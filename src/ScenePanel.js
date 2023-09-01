import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import {TreeView, TreeItem} from '@mui/lab';
import {styled} from '@mui/system';
import Box from '@mui/material/Box';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Button,
    FormControl,
    Radio,
    RadioGroup,
    FormLabel,
    FormControlLabel,
    Typography
} from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import {SketchPicker} from "react-color";

const CustomTreeView = styled(TreeView)`
  height: 240px;
  overflow-y: auto;
`;

const transformControlObjNames = ["Hemisphere Light", "Directional Light"];
let transformControlValues = {"Hemisphere Light": "none", "Directional Light": "none"};

const treeItemObjNames = ["Scene", "mainObject", "Hemisphere Light", "Directional Light", "Ground", "Grid", "Axis", "Preview Camera"];

const visibleControlObjNames = ["Directional Light", "Ground", "Grid", "Axis"];

let visibleValues = {"Directional Light": true, "Ground": true, "Grid": true, "Axis": true};

const ObjectContext = createContext([]);

function useObjectUpdate() {
    const context = useContext(ObjectContext);

    if (!context) {
        throw new Error('useObjectUpdate must be used within ObjectProvider');
    }

    return context;
}

function ObjectProvider({children}) {
    const [objects, setObjects] = useState([]);

    const updateObjects = (newObjects) => {
        setObjects(newObjects);
    };

    return (<ObjectContext.Provider value={{objects, updateObjects}}>
        {children}
    </ObjectContext.Provider>);
}

function processNode(node, handleSelectedObject, setSelectedObj, transformControlMap) {
    if (!node) {
        return null;
    }

    if (!(treeItemObjNames.includes(node.name) || node.name?.startsWith("mainObject"))) {
        return null;
    }

    return (<TreeItem key={node.uuid} nodeId={node.uuid} label={node.name || node.type} onClick={(objEvent) => {
        const objName = objEvent.target.innerHTML;

        handleSelectedObject(objName, transformControlMap[objName]);
        setSelectedObj(objName);
    }}>
        {node.children && node.children.map((child) => processNode(child, handleSelectedObject, setSelectedObj, transformControlMap))}
    </TreeItem>);
}

function ScenePanel({
                        refreshSceneTree,
                        handleSelectedObject,
                        setVisible,
                        setCameraNear,
                        setCameraFar,
                        setCameraFOV,
                        setCanvasBgColor,
                        removeObject
                    }) {
    return (<ObjectProvider>
        <SceneTreeWrapper refreshSceneTree={refreshSceneTree} handleSelectedObject={handleSelectedObject}
                          setVisible={setVisible}
                          setCameraNear={setCameraNear} setCameraFar={setCameraFar} setCameraFOV={setCameraFOV}
                          setCanvasBgColor={setCanvasBgColor} removeObject={removeObject}/>
    </ObjectProvider>)
}

function SceneTree({handleSelectedObject, setSelectedObj, transformControlMap}) {
    const {objects} = useObjectUpdate();

    return (<TreeView
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
        defaultEndIcon={<div/>}
    >
        {processNode(objects.object, handleSelectedObject, setSelectedObj, transformControlMap)}
    </TreeView>);
}

function SceneTreeWrapper({
                              refreshSceneTree,
                              handleSelectedObject,
                              setVisible,
                              setCameraNear,
                              setCameraFar,
                              setCameraFOV,
                              setCanvasBgColor,
                              removeObject
                          }) {
    const [selectedObj, setSelectedObj] = useState(null);
    const [far, setFar] = useState(1000);
    const [near, setNear] = useState(0.1);
    const [fov, setFOV] = useState(45);
    const [visibleMap, setVisibleMap] = useState(visibleValues);
    const [transformControlMap, setTransformControlMap] = useState(transformControlValues);
    const [bgColor, setBgColor] = useState();

    const {updateObjects} = useObjectUpdate();

    const updateObjectsRef = useRef();

    updateObjectsRef.current = updateObjects;

    useEffect(() => {
        window.updateObjects = (newObjects) => {
            if (updateObjectsRef.current) {
                updateObjectsRef.current(newObjects);
            }
        };
        return () => {
            window.updateObjects = null;
        };
    }, []);

    return (<div>
        <Box mb={1} mt={1}>
            <SceneTree handleSelectedObject={handleSelectedObject} setSelectedObj={setSelectedObj}
                       transformControlMap={transformControlMap}/>
            <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                    onClick={refreshSceneTree}>Refresh Scene Tree</Button>

            {(transformControlObjNames.includes(selectedObj) || (selectedObj && selectedObj.startsWith("mainObject"))) &&
                <FormControl>
                    <FormLabel>Operate</FormLabel>
                    <RadioGroup
                        aria-labelledby="operate-radio-buttons-group-label"
                        defaultValue="none"
                        name="operate-radio-buttons-group"
                        row={true}
                        onChange={(event) => {
                            handleSelectedObject(selectedObj, event.target.value);

                            const updatedMap = {...transformControlMap};

                            updatedMap[selectedObj] = event.target.value;

                            setTransformControlMap(updatedMap);
                        }}
                    >
                        <FormControlLabel value="none" control={<Radio/>} label="None"
                                          checked={transformControlMap[selectedObj] === "none" || !transformControlMap[selectedObj]}/>
                        <FormControlLabel value="translate" control={<Radio/>} label="Translate"
                                          checked={transformControlMap[selectedObj] === "translate"}/>
                        <FormControlLabel value="rotate" control={<Radio/>} label="Rotate"
                                          checked={transformControlMap[selectedObj] === "rotate"}/>
                    </RadioGroup>
                </FormControl>}
            {(visibleControlObjNames.includes(selectedObj) || (selectedObj && selectedObj.startsWith("mainObject"))) &&
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={visibleMap[selectedObj] || !(selectedObj in visibleMap)}
                            onChange={(event) => {
                                setVisible(selectedObj, event.target.checked);

                                const updatedMap = {...visibleMap};
                                updatedMap[selectedObj] = event.target.checked;
                                setVisibleMap(updatedMap);
                            }}
                            color="primary"
                        />
                    }
                    label='Visible'
                />
            }
            {
                selectedObj === "Preview Camera" && <Box width="100%">
                    <Typography gutterBottom>Near</Typography>
                    <Slider min={0.1} max={100}
                            valueLabelDisplay="auto"
                            step={0.1}
                            value={near}
                            onChange={(event, newValue) => {
                                setNear(newValue);
                                setCameraNear(newValue);
                            }}
                            aria-labelledby="continuous-slider"
                    />
                    <Typography gutterBottom>Far</Typography>
                    <Slider min={0.1} max={20000}
                            valueLabelDisplay="auto"
                            value={far}
                            onChange={(event, newValue) => {
                                setFar(newValue);
                                setCameraFar(newValue)
                            }}
                            aria-labelledby="continuous-slider"
                    />
                    <Typography gutterBottom>FOV</Typography>
                    <Slider min={1} max={100}
                            valueLabelDisplay="auto"
                            value={fov}
                            onChange={(event, newValue) => {
                                setFOV(newValue);
                                setCameraFOV(newValue);
                            }}
                            aria-labelledby="continuous-slider"
                    />
                </Box>
            }
            {
                selectedObj && selectedObj.startsWith("mainObject") &&
                <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                        onClick={() => {
                            removeObject(selectedObj);
                            refreshSceneTree();
                            setSelectedObj(null);
                        }}>Remove</Button>
            }
            {
                selectedObj === "Scene" && <SketchPicker
                    color={bgColor}
                    onChangeComplete={(color) => {
                        setBgColor(color);
                        setCanvasBgColor(color);
                    }}
                    disableAlpha={true}
                />
            }
        </Box>
    </div>);
}

export default ScenePanel;