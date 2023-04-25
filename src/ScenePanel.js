import React from 'react';
import {TreeView, TreeItem} from '@mui/lab';
import {styled} from '@mui/system';
import Box from '@mui/material/Box';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Accordion, AccordionSummary, AccordionDetails} from '@mui/material';

const CustomTreeView = styled(TreeView)`
  height: 200px;
  overflow-y: auto;
`;

function createTreeItems(objects, handleNodeClick) {
    return objects?.map((object) => {
        const hasChildren = object.children && object.children.length > 0;

        return (
            <TreeItem
                key={object.id}
                nodeId={object.id.toString()}
                label={object.name}
                onClick={() => handleNodeClick(object)}
            >
                {hasChildren && createTreeItems(object.children, handleNodeClick)}
            </TreeItem>
        );
    });
}

function ScenePanel({sceneObjects, handleNodeClick}) {
    return (
        <div>
            <Box mb={1} mt={1}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        Scene
                    </AccordionSummary>
                    <AccordionDetails>
                        <CustomTreeView>
                            {createTreeItems(sceneObjects, handleNodeClick)}
                        </CustomTreeView>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}

export default ScenePanel;