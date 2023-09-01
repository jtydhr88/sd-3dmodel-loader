import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import {TreeItem, TreeView} from "@mui/lab";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


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

function processNode(node, handlePoseSelectedObject, setSelectedObj, transformControlMap) {
    if (!node) {
        return null;
    }

    return (<TreeItem key={node.name} nodeId={node.name} label={node.name} onClick={(objEvent) => {
        const objName = objEvent.target.innerHTML;

        setSelectedObj(objName);

        handlePoseSelectedObject(objName, transformControlMap[objName]);
    }}>
        {node.children && node.children.map((child) => processNode(child, handlePoseSelectedObject, setSelectedObj, transformControlMap))}

    </TreeItem>);
}

const boneNameTransformMap = {
    'forearm': "none",
    'hand_joint': "none",
    'little_bone': "none",
    'little_prox': "none",
    'little_inter': "none",
    'little_dist': "none",
    'ring_bone': "none",
    'ring_prox': "none",
    'ring_inter': "none",
    'ring_dist': "none",
    'middle_bone': "none",
    'middle_prox': "none",
    'middle_inter': "none",
    'middle_dist': "none",
    'index_bone': "none",
    'index_prox': "none",
    'index_inter': "none",
    'index_dist': "none",
    'thumb_prox': "none",
    'thumb_inter': "none",
    'thumb_dist': "none",
};

const boneNameList = {
    "name": "hand",
    "children": [
        {
            "name": "thumb",
            "children": [
                {
                    "name": "thumb_prox",
                },
                {
                    "name": "thumb_inter",
                },
                {
                    "name": "thumb_dist",
                }
            ]
        },
        {
            "name": "index",
            "children": [
                {
                    "name": "index_bone",
                },
                {
                    "name": "index_prox",
                },
                {
                    "name": "index_inter",
                },
                {
                    "name": "index_dist",
                }
            ]
        },
        {
            "name": "middle",
            "children": [
                {
                    "name": "middle_bone",
                },
                {
                    "name": "middle_prox",
                },
                {
                    "name": "middle_inter",
                },
                {
                    "name": "middle_dist",
                }
            ]
        },
        {
            "name": "ring",
            "children": [
                {
                    "name": "ring_bone",
                },
                {
                    "name": "ring_prox",
                },
                {
                    "name": "ring_inter",
                },
                {
                    "name": "ring_dist",
                }
            ]
        },
        {
            "name": "little",
            "children": [
                {
                    "name": "little_bone",
                },
                {
                    "name": "little_prox",
                },
                {
                    "name": "little_inter",
                },
                {
                    "name": "little_dist",
                }
            ]
        },
    ]
}

function BodyTree({handlePoseSelectedObject, setSelectedObj, transformControlMap}) {
    return (<TreeView
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
        defaultEndIcon={<div/>}
    >
        {processNode(boneNameList, handlePoseSelectedObject, setSelectedObj, transformControlMap)}
    </TreeView>);
}

export default function HandPanel({
                                      handlePoseSelectedObject,
                                  }) {
    return (<ObjectProvider>
        <BodyTreeWrapper
                         handlePoseSelectedObject={handlePoseSelectedObject}/>
    </ObjectProvider>)
}

function BodyTreeWrapper({
                             handlePoseSelectedObject
                         }) {
    const [selectedObj, setSelectedObj] = useState(null);

    const {updateObjects} = useObjectUpdate();
    const [transformControlMap, setTransformControlMap] = useState(boneNameTransformMap);

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

            <BodyTree handlePoseSelectedObject={handlePoseSelectedObject} setSelectedObj={setSelectedObj}
                      transformControlMap={transformControlMap}/>
            {(selectedObj in boneNameTransformMap) && <FormControl>
                <FormLabel>Operate</FormLabel>
                <RadioGroup
                    aria-labelledby="operate-radio-buttons-group-label"
                    defaultValue="none"
                    name="operate-radio-buttons-group"
                    row={true}
                    onChange={(event) => {
                        handlePoseSelectedObject(selectedObj, event.target.value);

                        const updatedMap = {...transformControlMap};

                        updatedMap[selectedObj] = event.target.value;

                        setTransformControlMap(updatedMap);
                    }}
                >
                    <FormControlLabel value="none" control={<Radio/>} label="None"
                                      checked={transformControlMap[selectedObj] === "none"}/>
                    <FormControlLabel value="rotate" control={<Radio/>} label="Rotate"
                                      checked={transformControlMap[selectedObj] === "rotate"}/>
                </RadioGroup>
            </FormControl>}
        </Box>
    </div>);
}
