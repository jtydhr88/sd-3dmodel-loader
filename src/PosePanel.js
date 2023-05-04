import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";
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
	'hips': "none",
	'spine': "none",
    'chest': "none",
	'upperChest': "none",
	'neck': "none",
	'head': "none",
	'leftShoulder': "none",
	'leftUpperArm': "none",
	'leftLowerArm': "none",
	'leftHand': "none",
	'leftThumbMetacarpal': "none",
	'leftThumbProximal': "none",
	'leftThumbDistal': "none",
	'leftIndexProximal': "none",
	'leftIndexIntermediate': "none",
	'leftIndexDistal': "none",
	'leftMiddleProximal': "none",
	'leftMiddleIntermediate': "none",
	'leftMiddleDistal': "none",
	'leftRingProximal': "none",
	'leftRingIntermediate': "none",
	'leftRingDistal': "none",
	'leftLittleProximal': "none",
	'leftLittleIntermediate': "none",
	'leftLittleDistal': "none",
	'rightShoulder': "none",
	'rightUpperArm': "none",
	'rightLowerArm': "none",
	'rightHand': "none",
	'rightLittleProximal': "none",
	'rightLittleIntermediate': "none",
	'rightLittleDistal': "none",
	'rightRingProximal': "none",
	'rightRingIntermediate': "none",
	'rightRingDistal': "none",
	'rightMiddleProximal': "none",
	'rightMiddleIntermediate': "none",
	'rightMiddleDistal': "none",
	'rightIndexProximal': "none",
	'rightIndexIntermediate': "none",
	'rightIndexDistal': "none",
	'rightThumbMetacarpal': "none",
	'rightThumbProximal': "none",
	'rightThumbDistal': "none",
	'leftUpperLeg': "none",
	'leftLowerLeg': "none",
	'leftFoot': "none",
	'leftToes': "none",
	'rightUpperLeg': "none",
	'rightLowerLeg': "none",
	'rightFoot': "none",
	'rightToes': "none"
};

const boneNameList = {
    "name": "body",
    "children": [
        {
            "name": "mainBody",
            "children": [
                {
                    "name": "hips",
                },
                {
                    "name": "spine",
                },
                {
                    "name": "chest",
                },
                {
                    "name": "upperChest",
                },
                {
                    "name": "head",
                }
            ]
        },
        {
            "name": "leftArm",
            "children": [
                {
                    "name": "leftShoulder",
                },
                {
                    "name": "leftUpperArm",
                },
                {
                    "name": "leftLowerArm",
                },
                {
                    "name": "leftHand",
                    "children": [
                        {
                            "name": "leftThumb",
                            "children": [
                                {
                                    "name": "leftThumbMetacarpal",
                                },
                                {
                                    "name": "leftThumbProximal",
                                },
                                {
                                    "name": "leftThumbDistal",
                                },
                            ]
                        },
                        {
                            "name": "leftIndex",
                            "children": [
                                {
                                    "name": "leftIndexProximal",
                                },
                                {
                                    "name": "leftIndexIntermediate",
                                },
                                {
                                    "name": "leftIndexDistal",
                                },
                            ]
                        },
                        {
                            "name": "leftMiddle",
                            "children": [
                                {
                                    "name": "leftMiddleProximal",
                                },
                                {
                                    "name": "leftMiddleIntermediate",
                                },
                                {
                                    "name": "leftMiddleDistal",
                                },
                            ]
                        },
                        {
                            "name": "leftRing",
                            "children": [
                                {
                                    "name": "leftRingProximal",
                                },
                                {
                                    "name": "leftRingIntermediate",
                                },
                                {
                                    "name": "leftRingDistal",
                                },
                            ]
                        },
                        {
                            "name": "leftLittle",
                            "children": [
                                {
                                    "name": "leftLittleProximal",
                                },
                                {
                                    "name": "leftLittleIntermediate",
                                },
                                {
                                    "name": "leftLittleDistal",
                                }
                            ]
                        },
                    ]
                },
            ]
        },
        {
            "name": "rightArm",
            "children": [
                {
                    "name": "rightShoulder",
                },
                {
                    "name": "rightUpperArm",
                },
                {
                    "name": "rightLowerArm",
                },
                {
                    "name": "rightHand",
                    "children": [
                        {
                            "name": "rightThumb",
                            "children": [
                                {
                                    "name": "rightThumbMetacarpal",
                                },
                                {
                                    "name": "rightThumbProximal",
                                },
                                {
                                    "name": "rightThumbDistal",
                                },
                            ]
                        },
                        {
                            "name": "rightIndex",
                            "children": [
                                {
                                    "name": "rightIndexProximal",
                                },
                                {
                                    "name": "rightIndexIntermediate",
                                },
                                {
                                    "name": "rightIndexDistal",
                                },
                            ]
                        },
                        {
                            "name": "rightMiddle",
                            "children": [
                                {
                                    "name": "rightMiddleProximal",
                                },
                                {
                                    "name": "rightMiddleIntermediate",
                                },
                                {
                                    "name": "rightMiddleDistal",
                                },
                            ]
                        },
                        {
                            "name": "rightRing",
                            "children": [
                                {
                                    "name": "rightRingProximal",
                                },
                                {
                                    "name": "rightRingIntermediate",
                                },
                                {
                                    "name": "rightRingDistal",
                                },
                            ]
                        },
                        {
                            "name": "rightLittle",
                            "children": [
                                {
                                    "name": "rightLittleProximal",
                                },
                                {
                                    "name": "rightLittleIntermediate",
                                },
                                {
                                    "name": "rightLittleDistal",
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        {
            "name": "leftLeg",
            "children": [
                {
                    "name": "leftUpperLeg",
                },
                {
                    "name": "leftLowerLeg",
                },
                {
                    "name": "leftFoot",
                },
                {
                    "name": "leftToes",
                }
            ]
        },
        {
            "name": "rightLeg",
            "children": [
                {
                    "name": "rightUpperLeg",
                },
                {
                    "name": "rightLowerLeg",
                },
                {
                    "name": "rightFoot",
                },
                {
                    "name": "rightToes",
                }
            ]
        }
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

export default function PosePanel({
                                      setPoseModelFileName,
                                      handlePoseSelectedObject,
                                  }) {
    return (<ObjectProvider>
        <BodyTreeWrapper setPoseModelFileName={setPoseModelFileName}
                         handlePoseSelectedObject={handlePoseSelectedObject}/>
    </ObjectProvider>)
}

function BodyTreeWrapper({
                             setPoseModelFileName,
                             handlePoseSelectedObject
                         }) {
    const [selectedObj, setSelectedObj] = useState(null);

    const loadPoseModel = () => {
        setPoseModelFileName("pose.vrm");
    };

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
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    Pose
                </AccordionSummary>
                <AccordionDetails>
                    <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                            onClick={loadPoseModel}>Load Pose Model (VRM)</Button>
                    <div><h6>Pose edit only supports VRM file currently.</h6></div>
                    <BodyTree handlePoseSelectedObject={handlePoseSelectedObject} setSelectedObj={setSelectedObj} transformControlMap={transformControlMap}/>
                    { (selectedObj in boneNameTransformMap) && <FormControl>
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
                </AccordionDetails>
            </Accordion>
        </Box>
    </div>);
}
