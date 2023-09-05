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
import {_camera, _secondCamera} from "./ThreeJsScene";

const CustomTreeView = styled(TreeView)`
  height: 240px;
  overflow-y: auto;
`;

const transformControlObjNames = ["mainObject", "Hemisphere Light", "Directional Light"];
let transformControlValues = {"Hemisphere Light": "none", "Directional Light": "none"};

const treeItemObjNames = ["Scene", "mainObject", "Hemisphere Light", "Directional Light", "Ground", "Grid", "Axis", "Preview Camera", "hand model", "body model"];

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

        handleSelectedObject(objName);
        setSelectedObj(objName);
    }}>
        {node.children && node.children.map((child) => processNode(child, handleSelectedObject, setSelectedObj, transformControlMap))}
    </TreeItem>);
}

function ScenePanel({
                        configs,
                        refreshSceneTree,
                        handleSelectedObject,
                        setVisible,
                        setCameraNear,
                        setCameraFar,
                        setCameraFOV,
                        setCanvasBgColor,
                        removeObject, setGroundColor
                    }) {
    return (<ObjectProvider>
        <SceneTreeWrapper configs={configs} refreshSceneTree={refreshSceneTree}
                          handleSelectedObject={handleSelectedObject}
                          setVisible={setVisible}
                          setCameraNear={setCameraNear} setCameraFar={setCameraFar} setCameraFOV={setCameraFOV}
                          setCanvasBgColor={setCanvasBgColor} removeObject={removeObject}
                          setSceneGroundColor={setGroundColor}/>
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
                              configs,
                              refreshSceneTree,
                              handleSelectedObject,
                              setVisible,
                              setCameraNear,
                              setCameraFar,
                              setCameraFOV,
                              setCanvasBgColor,
                              removeObject, setSceneGroundColor
                          }) {
    visibleValues.Ground = configs.defaultShowGround;
    visibleValues.Grid = configs.defaultShowGird;
    visibleValues.Axis = configs.defaultShowAxis;

    const [selectedObj, setSelectedObj] = useState(null);
    const [far, setFar] = useState(1000);
    const [near, setNear] = useState(0.1);
    const [fov, setFOV] = useState(45);
    const [visibleMap, setVisibleMap] = useState(visibleValues);
    const [transformControlMap, setTransformControlMap] = useState(transformControlValues);
    const [bgColor, setBgColor] = useState(configs.defaultBGColor);
    const [groundColor, setGroundColor] = useState(configs.defaultGroundColor);

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
                                setCameraNear(_camera, _secondCamera, newValue);
                            }}
                            aria-labelledby="continuous-slider"
                    />
                    <Typography gutterBottom>Far</Typography>
                    <Slider min={0.1} max={20000}
                            valueLabelDisplay="auto"
                            value={far}
                            onChange={(event, newValue) => {
                                setFar(newValue);
                                setCameraFar(_camera, _secondCamera, newValue)
                            }}
                            aria-labelledby="continuous-slider"
                    />
                    <Typography gutterBottom>FOV</Typography>
                    <Slider min={1} max={100}
                            valueLabelDisplay="auto"
                            value={fov}
                            onChange={(event, newValue) => {
                                setFOV(newValue);
                                setCameraFOV(_camera, _secondCamera, newValue);
                            }}
                            aria-labelledby="continuous-slider"
                    />
                </Box>
            }
            {
                selectedObj && (selectedObj.startsWith("mainObject") || selectedObj.startsWith("hand model") || selectedObj.startsWith("body model")) &&
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
            {
                selectedObj === "Ground" && visibleMap["Ground"] && <SketchPicker
                    color={groundColor}
                    onChangeComplete={(color) => {
                        setGroundColor(color);
                        setSceneGroundColor(color);
                    }}
                    disableAlpha={true}
                />
            }
            <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                    onClick={refreshSceneTree}>Refresh Scene Tree</Button>
        </Box>
    </div>);
}

export default ScenePanel;