import React, {useState,useEffect} from 'react';
import axios from 'axios';
import "./Hierarchy.scss";
import { Box, Typography, Card, TextField, InputAdornment, FormControlLabel, Checkbox, Button ,SvgIcon,CircularProgress } from '@mui/material';
import { faFileImport, faFileExport, faTrashAlt, faPlus, faPenToSquare, faClose, faSquareXmark, faCubes, faToolbox } from '@fortawesome/pro-regular-svg-icons';
import {  faSquareMinus, faSquarePlus,fas } from '@fortawesome/pro-solid-svg-icons';
import { Textarea } from '@mui/joy';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import Upload from '../Upload/Upload';
import { alpha, styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import IconLibraryPage from './IconLibrary/IconLibrary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteDialog from '../DeleteDialog';
import { useSelector } from 'react-redux';
function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}><FontAwesomeIcon icon={faSquareMinus} /> </SvgIcon>
    );
}
function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}><FontAwesomeIcon icon={faSquarePlus} /></SvgIcon>
    );
}

const CustomTreeItem = React.forwardRef((props, ref) => (
    <TreeItem {...props} ref={ref} />
));

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: { '& .close': { opacity: 0.3, }, },
    [`& .${treeItemClasses.group}`]: { marginLeft: 15, paddingLeft: 18, borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`, },
}));

export default function HierarchyRight() {
    const [isLoading, setLoading] = useState(true);
    const [isCheckboxChecked, setCheckboxChecked] = useState(false);
    const [isParameterboxChecked, setParameterChecked] = useState(false);
    const [parameterName, setParameterName] = useState('');
    const [globalCode, setGlobalCode] = useState('');
    const [newHierarchy, setNewHierarchy] = useState(false);
    const [integer, setInteger] = useState(false);
    const [upload, setUpload] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState('0');
    const [unitOptions, setUnitOptions] = useState(0);
    const [aggregationOptions, setAggregationOptions] = useState(0);
    const [aggregationParameterOption, setAggregationParameterOption] = useState(0);
    const [selectedAggregation, setSelectedAggregation] = useState(0);
    const [selectedAggregationParameter, setSelectedAggregationParameter] = useState(0);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [parameterDescription, setParameterDescription] = useState('');
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(0);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [isEditing, setEditing] = useState(false);
    const [editedNode, setEditedNode] = useState(null);
    const [newItemText, setNewItemText] = useState('');
    const [description, setDescription] = useState('');
    const [selectedNodeId, setSelectedNodeId] = useState('');
    const [selectedDeleteId, setSelectedDeleteId] = useState('');
    const [selectedParameterId, setSelectedParameterId] = useState('');
    const [treeData, setTreeData] = useState([]);
    const [indexIs, setIndex] = useState("");
    const [renamedValue, setRenamedValue] = useState('');
    const [selectedRename, setSelectedRename] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [options, setOptions] = useState([]);
    const [levelId, setLevelId] = useState('');
    const [parentId, setParentId] = useState('');
    const [deleteEquipment, setDeleteEquipment] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTime, setSelectedTime] = useState("0");
    const [parameterId, setParameterId] = useState("");
    const [equipmentData, setEquipmentData] = useState([]);
    const [renamingMapping, setRenamingMapping] = useState({});
    const [isExternalParameterAdded, setExternalParameterAdded] = useState(false);
    const [availableEquipmentList, setAvailableEquipmentList] = useState([])
    const [existingGlobalCodes, setExistingGlobalCodes] = useState([]);
    const [existingParameterNames, setExistingParameterNames] = useState([]);
    const [globalCodeError, setGlobalCodeError] = useState('');
    const [parameterNameError, setParameterNameError] = useState('');
    const [renameField, setRenameField] = useState(false);
    const [addIconDisabled, setIsAddIconDisabled] = useState(true);
    const [deleteIconDisabled, setDeleteIconDisabled] = useState(false);
    const [runEffect, setRunEffect] = useState(true);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [categories, setCategories] = useState([]);
    const [equipmentId, setEquipmentId] = useState(null);
    const [paramEquip, setParamEquip] = useState(false);
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const handleIconSelect = (icon) => {
       setSelectedIcon(icon.iconName);
    };

    const [renamedPairs, setRenamedPairs] = useState({});
    const handleClear = () => {
        setInteger(false);
        setNewItemText("");
        setDescription('');
        setSelectedIcon('');
        setRenamedPairs([]);
        setGlobalCode('');
        setSelectedUnit('0')
        setMaxValue(0);
        setMinValue(0);
        setParameterName('');
        setParameterDescription('');
        setSelectedCategory(0);
        setSelectedTime('0');
        setSelectedParameter(0);
        setSelectedRename('');
        setSelectedEquipment([]);
        setRenamingMapping({});
        setParameterChecked(false);
        setCheckboxChecked(false);
        setSelectedAggregation('0');
        setSelectedAggregationParameter('0');
        //setSelectedParameterId("");
        setGlobalCodeError('');
        setParameterNameError('')
    }
    const handleAddClick = (equipment) => {
        setRenameField(false);    
        if (!selectedEquipment.includes(equipment)) {
            setSelectedEquipment((prevSelected) => [...prevSelected, equipment]);
        }
        setAvailableEquipmentList((prevList) => prevList.filter(item => item !== equipment));
        setRenamingMapping((prevMapping) => ({
            ...prevMapping,
            [equipment]: equipment,
        }));  
    };
    const handleRemoveClick = (equipment) => {
        setRenameField(false);
        const newObject = { ...renamingMapping };
        delete newObject[equipment];
        setRenamingMapping(newObject);
        setRenamedValue('');    
        setSelectedEquipment((prevSelected) => prevSelected.filter(item => item !== equipment));
      //  setRemovedEquipmentList((prevList) => [...prevList, equipment]);    
        setAvailableEquipmentList((prevList) => [...prevList, equipment]);
    };   

    const handleRenameClick = (selected) => {
        setRenameField(!renameField)
        setRenamedValue(selected);
        const inde = selectedEquipment.indexOf(selected);
        setIndex(selected);     
    };
//save renamed Equipment
    const handleDoneClick = () => {
        if (renamedValue === '') {
            return;
        }
        const selectedValue = renamingMapping[selectedEquipment[indexIs]];
        const foundKey = Object.keys(renamingMapping).find(key => renamingMapping[key] === indexIs);
        setRenamingMapping((prevMapping) => ({ ...prevMapping, [foundKey]: renamedValue }));
        setRenamedPairs((prevPairs) => ({ ...prevPairs, [selectedValue]: renamedValue }));
        setRenamedValue('');
    };  
    const findNodeByIdEdit = (sublevels, id) => {
        for (let i = 0; i < sublevels.length; i++) {
            if (sublevels[i].id === id) {
                return sublevels[i];
            }
            if (sublevels[i].sub_levels && sublevels[i].sub_levels.length > 0) {
                const foundNode = findNodeByIdEdit(sublevels[i].sub_levels, id);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    };

    const handleEditClick = () => {
        const nodeToEdit = selectedParameterId !== '' ? findNodeByIdEdit(treeData, selectedNodeId) : findNodeByIdEdit(treeData, selectedNodeId);
        if (nodeToEdit && equipmentId != null) {
            setNewHierarchy(true);
            setEditing(true);
            setEditedNode(nodeToEdit);
            setNewItemText(nodeToEdit.level_name || '');
            setSelectedIcon(nodeToEdit.level_icon);
            setDescription(nodeToEdit.level_description || '');
            const selectedEquipmentList = nodeToEdit.equipments.selected_equipment_asset.filter(equipment => equipment.id === equipmentId);
            setSelectedEquipment(selectedEquipmentList);
            const unselectedEquipmentList = nodeToEdit.equipments.unselected_equipment_asset.map(equipment => equipment.actual_equipment_name);
            setAvailableEquipmentList(unselectedEquipmentList)
    
            let selectedObjectsIs = {};
            selectedEquipmentList.forEach((ele) => {
                selectedObjectsIs[ele.actual_equipment_name] = ele.renamed_equipment_name;
            });
            setRenamingMapping(selectedObjectsIs);
            setSelectedEquipment(Object.keys(selectedObjectsIs));
    
            if (nodeToEdit.equipments.selected_equipment_asset.length > 0) {
                setCheckboxChecked(true);
            }
            if (selectedParameterId !== '' && nodeToEdit.params.length > 0) {
                const parameter = nodeToEdit.params.find(param => param.id === selectedParameterId);
                if (parameter) {
                    setParameterId(parameter.id || '');
                    setParameterChecked(true);
                    setGlobalCode(parameter.global_code || '');
                    setSelectedUnit(parameter.uom.id || '');
                    setMaxValue(parameter.max_value || 0);
                    setMinValue(parameter.min_value || 0);
                    setParameterName(parameter.global_parameter_name || '');
                    setParameterDescription(parameter.global_parameter_description || '');
                    setSelectedCategory(parameter.category_type.id)
                    setSelectedTime(parameter.frequency_type.id || '');
                    setSelectedParameter(parameter.data_type.id || '');
                    setSelectedAggregation(parameter.aggregation_type.id || '');
                    if (parameter.aggregation_base_ref_id !=null) {
                        setSelectedAggregationParameter(parameter.aggregation_base_ref_id.id );
                    } else if (parameter.frequency_type.id > 0) {
                        setSelectedAggregationParameter('0');
                    }   
                    if (parameter.data_type.id == 1 || parameter.data_type.id ==2) {
                        setInteger(true);
                    }
                }
            } else {
                setParameterId('');
                setParameterChecked(false);
                setGlobalCode('');
                setSelectedUnit('0');
                setInteger(false);
                setMaxValue(0);
                setMinValue(0);
                setParameterName('');
                setParameterDescription('');
                setSelectedCategory(0);
                setSelectedTime('0');
                setSelectedParameter(0);
                setSelectedAggregation('0');
                setSelectedAggregationParameter('0');
            }
        }else if (nodeToEdit && paramEquip){
                setNewHierarchy(true);
                setEditing(true);
                setEditedNode(nodeToEdit);
                setNewItemText(nodeToEdit.level_name || '');
                setSelectedIcon(nodeToEdit.level_icon);
                setDescription(nodeToEdit.level_description || '');
                
                const selectedEquipmentList = nodeToEdit.equipments.selected_equipment_asset.map(equipment => equipment.renamed_equipment_name);
                setSelectedEquipment(selectedEquipmentList);
        
                const unselectedEquipmentList = nodeToEdit.equipments.unselected_equipment_asset.map(equipment => equipment.actual_equipment_name);
                setAvailableEquipmentList(unselectedEquipmentList)
        
                let selectedObjectsIs = {};
                nodeToEdit.equipments.selected_equipment_asset.forEach((ele) => {
                    selectedObjectsIs[ele.actual_equipment_name] = ele.renamed_equipment_name;
                });
                setRenamingMapping(selectedObjectsIs);
                setSelectedEquipment(Object.keys(selectedObjectsIs));
        
                if (nodeToEdit.equipments.selected_equipment_asset.length > 0) {
                    setCheckboxChecked(false);
                }      
                if (selectedParameterId !== '' && nodeToEdit.equipments.selected_equipment_asset.length > 0) {
                    for (const equipment of nodeToEdit.equipments.selected_equipment_asset) {
                        const parameter = equipment.params.find(param => param.id === selectedParameterId);
                        if (parameter) {
                            setParameterId(parameter.id || '');
                            setParameterChecked(true);
                            setGlobalCode(parameter.global_code || '');
                            setSelectedUnit(parameter.uom.id || '');
                            setMaxValue(parameter.max_value || 0);
                            setMinValue(parameter.min_value || 0);
                            setParameterName(parameter.global_parameter_name || '');
                            setParameterDescription(parameter.global_parameter_description || '');
                            setSelectedCategory(parameter.category_type.id || '');
                            setSelectedTime(parameter.frequency_type.id || '');
                            setSelectedParameter(parameter.data_type.id || '');
                            setSelectedAggregation(parameter.aggregation_type.id || '');
                            if (parameter.aggregation_base_ref_id != null) {
                                setSelectedAggregationParameter(parameter.aggregation_base_ref_id.id || '');
                            } else {
                                setSelectedAggregationParameter('0');
                            }
                            if (parameter.data_type.value == 1 || parameter.data_type.value == 2) {
                                setInteger(true);
                            }
                            break; 
                        }
                    }
                }
                 else {
                    setParameterId('');
                    setParameterChecked(false);
                    setGlobalCode('');
                    setSelectedUnit('0');
                    setMaxValue(0);
                    setMinValue(0);
                    setParameterName('');
                    setParameterDescription('');
                    setSelectedCategory(0);
                    setSelectedTime('0');
                    setSelectedParameter(0);
                    setSelectedAggregation('0');
                    setSelectedAggregationParameter('0');
                    setInteger(false);
                }
            }
        
        else if (nodeToEdit) {
            setNewHierarchy(true);
            setEditing(true);
            setEditedNode(nodeToEdit);
            setNewItemText(nodeToEdit.level_name || '');
            setSelectedIcon(nodeToEdit.level_icon);
            setDescription(nodeToEdit.level_description || '');
            
            const selectedEquipmentList = nodeToEdit.equipments.selected_equipment_asset.map(equipment => equipment.renamed_equipment_name);
            setSelectedEquipment(selectedEquipmentList);
    
            const unselectedEquipmentList = nodeToEdit.equipments.unselected_equipment_asset.map(equipment => equipment.actual_equipment_name);
            setAvailableEquipmentList(unselectedEquipmentList)
    
            let selectedObjectsIs = {};
            nodeToEdit.equipments.selected_equipment_asset.forEach((ele) => {
                selectedObjectsIs[ele.actual_equipment_name] = ele.renamed_equipment_name;
            });
            setRenamingMapping(selectedObjectsIs);
            setSelectedEquipment(Object.keys(selectedObjectsIs));
    
            if (nodeToEdit.equipments.selected_equipment_asset.length > 0) {
                setCheckboxChecked(true);
            }
    
            if (selectedParameterId !== '' && nodeToEdit.params.length > 0) {
                const parameter = nodeToEdit.params.find(param => param.id === selectedParameterId);
                if (parameter) {
                    setParameterId(parameter.id || '');
                    setParameterChecked(true);
                    setGlobalCode(parameter.global_code || '');
                    setSelectedUnit(parameter.uom.id || '');
                    setMaxValue(parameter.max_value || 0);
                    setMinValue(parameter.min_value || 0);
                    setParameterName(parameter.global_parameter_name || '');
                    setParameterDescription(parameter.global_parameter_description || '');
                    setSelectedCategory(parameter.category_type.id)
                    setSelectedTime(parameter.frequency_type.id || '');
                    setSelectedParameter(parameter.data_type.id || '');
                    setSelectedAggregation(parameter.aggregation_type.id || '');
                    if (parameter.aggregation_base_ref_id !=null) {
                        setSelectedAggregationParameter(parameter.aggregation_base_ref_id.id );
                    } else if (parameter.frequency_type.id > 0) {
                        setSelectedAggregationParameter('0');
                    } 
                    if (parameter.data_type.id == 1 || parameter.data_type.id == 2 ){
                        setInteger(true);
                    }
                }
            } else {
                setParameterId('');
                setParameterChecked(false);
                setGlobalCode('');
                setSelectedUnit('0');
                setMaxValue(0);
                setMinValue(0);
                setParameterName('');
                setParameterDescription('');
                setSelectedCategory(0);
                setSelectedTime('0');
                setSelectedParameter(0);
                setSelectedAggregation('0');
                setSelectedAggregationParameter('0');
                setInteger(false);
            }
        }
    };
  
    const handleParameterChange = (event) => {
        const value = Number(event.target.value);
        setSelectedParameter(value);
        if (value == 1 || value ==2) {
            setInteger(true)
        } else {
            setInteger(false)
        }
    };
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
       
    };  

    const handleCheckboxChange = (event) => {
        setCheckboxChecked(event.target.checked);
    };
    const handleParameterboxChange = (event) => {
        setParameterChecked(event.target.checked);
    };

    const renderTree = (nodes) => (    
        <StyledTreeItem key={`${nodes.level_id}-${nodes.id}`} nodeId={`${nodes.level_id}-${nodes.id}`} label={
            <div className='styled-tree' >
                {nodes.level_icon && <FontAwesomeIcon icon={fas[nodes.level_icon]} className='font-icon-tree' style={{color:'#0031cd'}} />}
                <div className='styled-label'>{nodes.level_name}</div>
            </div>
        } onClick={(event) => handleTreeItemClick(event, nodes.id, nodes.level_id)} 
        >
            {nodes.params && nodes.params.length > 0 && (
                nodes.params.map((param) => (
                    <StyledTreeItem key={`param-${param.global_code}`} nodeId={`param-${param.global_code}`} label={
                        <div className='styled-tree' >
                            <div className='styled-label'> <FontAwesomeIcon icon={faCubes} className='param-icon' style={{marginLeft:"5px", color:'#2bae18'}}/>{param.global_code}</div>
                        </div>
                    } onClick={(event) => handleParameterClick(param.id,nodes.id)} />
                ))
            )}
            {nodes.equipments && nodes.equipments.selected_equipment_asset && nodes.equipments.selected_equipment_asset.length > 0 && (
                nodes.equipments.selected_equipment_asset.map((equipment) => (
                    <React.Fragment key={`equipment-${equipment.renamed_equipment_name}`}>
                        <StyledTreeItem key={`equipment-${equipment.renamed_equipment_name}`} nodeId={`equipment-${equipment.renamed_equipment_name}`} label={
                            <div className='styled-tree' >
                                <div className='styled-label'> <FontAwesomeIcon icon={faToolbox} className='param-icon' style={{marginLeft:"5px",color:'#CA7300'}}/>{equipment.renamed_equipment_name}</div>
                            </div>
                        }  onClick={(event) => handleEquipmentClick(nodes.id, equipment.renamed_equipment_name, equipment.id)}>
                        {/* Include parameters as the next level under each equipment */}
                        {equipment.params && equipment.params.length > 0 && equipment.params.map((param) => (
                            <StyledTreeItem key={`equipment-${equipment.renamed_equipment_name}-param-${param.global_code}`} nodeId={`equipment-${equipment.renamed_equipment_name}-param-${param.global_code}`} label={
                                <div className='styled-tree' >
                                    <div className='styled-label'> <FontAwesomeIcon icon={faCubes} className='param-icon' style={{marginLeft:"5px",color:'#2bae18'}}/>{param.global_code}</div>
                                </div>
                            } onClick={(event) => handleEquipmentParam(param.id,nodes.id, equipment.id)} />
                        ))}
                        </StyledTreeItem>
                    </React.Fragment>
                ))
            )}
            {Array.isArray(nodes.sub_levels) ? nodes.sub_levels.map((node) => renderTree(node)) : null}
        </StyledTreeItem>        
    );
    
    useEffect(() => {
        fetchHierarchyData();      
    }, [selectedNodeId,BASE_URL]);

  //Endpoint for Entire Tree  data
  const fetchHierarchyData = () => {
    axios.get(`${BASE_URL}hierarchy_app/api/all_level_details/`)
        .then(response => {
            setLoading(false)
            const hierarchyData = response.data;

            let externalParameterAdded = false;
            let codes = [];
            let names = [];

            const traverseTree = (node) => {
                if (Array.isArray(node)) {
                    node.forEach(subNode => traverseTree(subNode));
                } else {
                    if (node.params) {
                        node.params.forEach(param => {
                            if (!param.is_computed) {
                                externalParameterAdded = true;
                                codes.push(param.global_code);
                                names.push(param.global_parameter_name);
                            }
                        });
                    }
                    if (node.sub_levels) {
                        traverseTree(node.sub_levels);
                    }
                }
            };
            traverseTree(hierarchyData);
            setTreeData(hierarchyData);
            setExistingGlobalCodes(codes);
            setExistingParameterNames(names);
            if (externalParameterAdded) {
                setExternalParameterAdded(true);
            }
        })
        .catch(error => {
            console.error('Error fetching hierarchy data:', error);
        });
};
    
    const handleTreeItemClick = (event, nodeId, level_id,) => {
        setLevelId(level_id);
        setParentId(nodeId);
        setSelectedNodeId(nodeId);
        fetchHierarchyData();
        setNewHierarchy(false)
        setSelectedParameterId('');
        setSelectedDeleteId(nodeId)
        setEditing(false);
        setIsAddIconDisabled(true);
        setDeleteIconDisabled(true);
        setRunEffect(false);
        setEquipmentId(null)
        setParamEquip(false)
        setInteger(false);
    };
    const handleEquipmentClick = ( nodeId, equipmentName,id) => {
        setEquipmentId(id);
        setDeleteEquipment(equipmentName)
        setSelectedNodeId(nodeId);
       // setSelectedDeleteId(nodeId);
       setSelectedDeleteId(id)
        setNewHierarchy(false);
        setSelectedParameterId('')
        setIsAddIconDisabled(false);
        setDeleteIconDisabled(true);
        setParamEquip(false)
    };
    const handleParameterClick = (id,nodeId,eqId) => {
        setDeleteEquipment("")
       setSelectedParameterId(id);
       setSelectedNodeId(nodeId)
       setNewHierarchy(false);
       setSelectedDeleteId(id)
       setIsAddIconDisabled(false);
       setDeleteIconDisabled(true);
       setEquipmentId(null)
       setParamEquip(false)
       setInteger(false)
    };
    const handleEquipmentParam = (id,nodeId,eqId) => {
        setParamEquip(true)
        setDeleteEquipment("")
       setSelectedParameterId(id);
       setSelectedNodeId(nodeId)
       setNewHierarchy(false);
       setSelectedDeleteId(id)
       setIsAddIconDisabled(false);
       setDeleteIconDisabled(true);
       setEquipmentId(null)
       setCheckboxChecked(false)
    };
    useEffect(() => {
        if (runEffect) {
            if (treeData.length > 0) {
                setIsAddIconDisabled(false);
            } else {
                setIsAddIconDisabled(true);
            }
        }
    }, [treeData, runEffect]);
   const handleEquipmentDone = ()=>{
    setNewHierarchy(false);
   }
    const handleAddButtonClick = () => {
    const putData = {
        level: {
            level_name: newItemText,
            level_description: description,
            level_icon: selectedIcon,
            level_id: levelId,
            level_parentid: parentId,
        },
        param_update: {},
        param_add: {},
        equipments: [renamingMapping]
    };
    const parameterData = {
        global_code: globalCode,
        global_parameter_name: parameterName,
        global_parameter_description: parameterDescription,
        uomid: selectedUnit,
        datatypeid: selectedParameter,
        categorytypeid: selectedCategory,
        frequencytypeid: selectedTime,
        minValue: minValue,
        maxValue: maxValue,
        aggregationtypeid: selectedAggregation,
        aggregation_base_ref_id: selectedAggregationParameter,
    };

    if (selectedParameterId !== '' && parameterName !== '') {
        putData.param_update = { id: parameterId, ...parameterData };
    } else if (parameterName !== '' && selectedParameterId == '') {
        putData.param_add = parameterData;
    }
    const handleRequest = (url, method, params = {}) => {
        axios[method](url, { ...putData, ...params })
            .then(response => {
                console.log(`${method} success:`, response.data);
            })
            .catch(error => {
                console.error(`Error making ${method} request:`, error);
            });
    };
    if (isEditing && editedNode) {
        handleRequest(`${BASE_URL}hierarchy_app/api/update_level/?id=${selectedNodeId}`, 'put');
        setEditing(false);
        setEditedNode(null);
        setNewHierarchy(false);
    } 
    else {
        fetchHierarchyData();
        if (existingGlobalCodes.includes(globalCode)) {
            setGlobalCodeError('Duplicate globalCode');
            return;
        }
        if (existingParameterNames.includes(parameterName)) {
            setParameterNameError('Duplicate parameterName');
            return;
        }
        handleRequest(`${BASE_URL}hierarchy_app/api/create_level/?level_id=${levelId}&id=${parentId}`, 'post', { params: parameterName ? parameterData : {} });
    }
    handleClear();
    setNewHierarchy(false);
    if (selectedCategory == 1) {
        setExternalParameterAdded(true);
    }
    fetchHierarchyData();
};

    const handleDeleteButtonClick = () => {
        if (selectedNodeId !== null) {
            setShowDeleteConfirmation(true);
        }
    };
    const handleDeleteConfirm = () => {
        axios.delete(`${BASE_URL}hierarchy_app/api/delete_level/?id=${selectedDeleteId}`)
            .then(response => {
                setSelectedNodeId(null);
                setDeleteEquipment('');
                fetchHierarchyData();
            })
                setShowDeleteConfirmation(false);
    };
    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };
    const handleAddHierarchy = () => {   
            // If neither id nor levelId is present, make a GET request to fetch level details
            axios.get(`${BASE_URL}hierarchy_app/api/level_detail/`)
                .then(response => {
                    console.log('GET success:enter', response.data);
                    // Check if response.data is an array and has at least one element
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const unselectedEquipments = response.data[0].unselected_equipment_asset || [];
                        if (Array.isArray(unselectedEquipments)) {
                            const unselectedEquipmentNames = unselectedEquipments.map(ele => ele.actual_equipment_name);
                            setAvailableEquipmentList(unselectedEquipmentNames);
                            setEquipmentData(response.data[0].unselected_equipment_asset)
                        } 
                    } 
                })
                .catch(error => {
                    console.error('Error making GET request:', error);
                });        
        setEditing(false);
        handleClear();
        setNewHierarchy(true); 
    }
    useEffect(() => {
        if (newHierarchy && !isEditing) {
            const equipmentList =  equipmentData;     
            const availableEquipmentListNew = equipmentList?.filter(equipment => !selectedEquipment.includes(equipment.actual_equipment_name)) || [];
            const actualEquipmentNames = availableEquipmentListNew.map(equipment => equipment.actual_equipment_name);
            setAvailableEquipmentList(actualEquipmentNames);
        }
    }, [newHierarchy, selectedEquipment]);   
    //Endpoint for Type of Parameter
    useEffect(() => {
        axios.get(`${BASE_URL}global_master_app/api/data_type/`)
            .then(response => { setOptions(response.data) })
            .catch(error => { console.error('Error fetching options:', error); });
    }, [BASE_URL]);
    //EndPoint for Computed parameter
    useEffect(() => {
            const typeOfParameter = selectedCategory == 1 ? "External Parameters" : "Aggregated Parameters";
            axios.get(`${BASE_URL}global_master_app/api/frequency_type/?category=${typeOfParameter}`)
                .then(response => { setTimeOptions(response.data); })              
                .catch(error => { console.error('Error fetching time options:', error); });
     
    }, [selectedCategory]);
    //Endpoint for unit of measurement
    useEffect(() => {
        axios.get(`${BASE_URL}global_master_app/api/unit_type/`)
            .then(response => { setUnitOptions(response.data); })
            .catch(error => { console.error('Error fetching unit options:', error); });
    }, [BASE_URL]);
    //Endpoint for aggregation type
    useEffect(() => {
        axios.get(`${BASE_URL}global_master_app/api/aggregation_type/`)
            .then(response => { setAggregationOptions(response.data); })
            .catch(error => { console.error('Error fetching unit options:', error); });
    }, [BASE_URL]);
     //Endpoint for aggregation base parameter
    useEffect(() => {
        if (selectedParameterId !== '' && isEditing) {
            axios.get(`${BASE_URL}hierarchy_app/api/aggregation_base_reference/?id=${selectedParameterId}`)
                .then(response => { setAggregationParameterOption(response.data); })
                .catch(error => {
                    console.error('Error making get request:', error);
                });
        } else {
            axios.get(`${BASE_URL}hierarchy_app/api/aggregation_base_reference/`)
                .then(response => { setAggregationParameterOption(response.data); })
                .catch(error => { console.error('Error fetching unit options:', error); });
        }
    }, [selectedParameterId, isEditing]);
    const handleCloseClick = () => {
        setNewHierarchy(false);
        handleClear()
    } 
//endPoint for type of parameter
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/category_type/`);
            setCategories(response.data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };    
        fetchData();
      }, [BASE_URL]);
      const handleAddParameterEquipment = async () => {
        const putData = {
            level: {
                level_name: newItemText,
                level_description: description,
                level_icon: selectedIcon,
                level_id: levelId,
                level_parentid: parentId,
            },
            param_update: {},
            param_add: {},
            equipments: []
        };
        const parameterData = {
            global_code: globalCode,
            global_parameter_name: parameterName,
            global_parameter_description: parameterDescription,
            uomid: selectedUnit,
            datatypeid: selectedParameter,
            categorytypeid: selectedCategory,
            frequencytypeid: selectedTime,
            minValue: minValue,
            maxValue: maxValue,
            aggregationtypeid: selectedAggregation,
            aggregation_base_ref_id: selectedAggregationParameter,
        };
    
        if (parameterName !== '') {
            if (selectedParameterId !== '') {
                putData.param_update = { id: selectedParameterId, ...parameterData };
            } else {
                putData.param_add = parameterData;
            }
    
            try {
                const url = selectedParameterId ? `${BASE_URL}hierarchy_app/api/update_level/?id=${selectedParameterId}` : `${BASE_URL}hierarchy_app/api/update_level/?id=${equipmentId}`;
                const response = await axios.put(url, putData);
                fetchHierarchyData();
                setParameterId('');
                setGlobalCode('');
                setSelectedUnit('0');
                setMaxValue(0);
                setMinValue(0);
                setParameterName('');
                setParameterDescription('');
                setSelectedCategory(0);
                setSelectedTime('0');
                setSelectedParameter(0);
                setSelectedAggregation('0');
                setSelectedAggregationParameter('0');
                if (selectedParameterId !== ''){
                    handleCloseClick();
                }
            } catch (error) {
                console.error("Error adding/updating parameter:", error);
            }
        } else {
            console.error("Parameter name cannot be empty.");
        }
    };
    
    return (
        <div className='hierarchy-main-head'>
            <Box className="hierarchy-panel-main" style={{ width: newHierarchy ? '50%' : '100%' }}>
                <Box className='hierarchy-title'>
                    <Typography className='title-text'>Hierarchy</Typography>
                    <div className='icon-group'>
                        <Card className='icon-card' onClick={() => setUpload(true)}><FontAwesomeIcon icon={faFileImport} /></Card>
                        <Card className='icon-card'><FontAwesomeIcon icon={faFileExport} /></Card>
                        {deleteIconDisabled && <Card className='icon-card' onClick={handleEditClick}><FontAwesomeIcon icon={faPenToSquare} /></Card>}
                        {addIconDisabled && <Card className='icon-card' onClick={handleAddHierarchy}><FontAwesomeIcon icon={faPlus} /></Card>}
                        {deleteIconDisabled && <Card className='icon-card' onClick={handleDeleteButtonClick}><FontAwesomeIcon icon={faTrashAlt} /></Card>}
                    </div>
                </Box>
                {isLoading ? (
        <Box className='new-loader'>
          <CircularProgress className="circular-progress-lens" />
        </Box>
      ) : (
                <Box className='hierarchy-main-box' >
                    <TreeView aria-label="customized" defaultExpanded={['1']} defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}  sx={{ overflowX: 'hidden', flexGrow: 1 }} >
                        {treeData.map((node) => renderTree(node))}
                    </TreeView>
                </Box>
      )}
            </Box>
            {newHierarchy &&
                <Box className='hierarchy-panel-main'>
                    <Box className='hierarchy-title'>
                        <Typography className='title-text'>New Level Hierarchy</Typography>
                        <FontAwesomeIcon icon={faClose} className='close-icon' onClick={handleCloseClick} />
                    </Box>
                    <div className='hierarchy-right-box'>
                        <Box className='hierarchy-sub-menu'>
                            <Box className='hierarchy-title-new'>
                                <Typography className='title-text'> Level Hierarchy</Typography>
                            </Box>
                            <div className='flex-submenu' >
                                <div className='submenu' style={{ width: '60%' }}>
                                    <Typography className='sub-menu-name'>Name</Typography>
                                    <TextField className='sub-menu-text' placeholder='Enter the Name' value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)} disabled={equipmentId !==null || paramEquip} />
                                </div>
                                <div className='submenu' style={{ width: '40%' }}  >
                                    <IconLibraryPage iconFunc={handleIconSelect}  iconNameIs={selectedIcon} equipmentId={equipmentId || paramEquip}/>
                                </div>
                            </div>
                            <div className='submenu' >
                                <Typography className='sub-menu-name'>Description</Typography>
                                <Textarea className='sub-menu-textarea' placeholder='Enter the Description' value={description}
                                    onChange={(e) => setDescription(e.target.value)} disabled={equipmentId !==null || paramEquip} />
                            </div>
                        </Box>
                        <Box className='hierarchy-sub-menu'>
                           
                            <Box className='hierarchy-title-checkbox'>
                                <FormControlLabel
                                    control={<Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange} disabled={paramEquip}/>}
                                    label="Add Equipment / Assets"
                                />
                            </Box>

                            {isCheckboxChecked && (
                                <div className='equipment-add-asset'>
                                     {equipmentId === null &&
                                    <Box className='asset-list'>
                                        {availableEquipmentList.map((equipment, index) => (
                                            <Typography key={index} className='asset-list-name'> {equipment}
                                            <FontAwesomeIcon icon={faSquarePlus} onClick={() => handleAddClick(equipment)} />
                                            </Typography>
                                        ))}
                                    </Box>
}
                                    <Box className='asset-list'>
                                        {selectedEquipment.map((selected, index) => (
                                            <div className='rename-asset-namelist'  >
                                                <Typography
                                                    key={selected.name}
                                                    className='asset-list-name'
                                                    value={selectedRename}
                                                    onChange={(e) => setSelectedRename(e.target.value)}
                                                    onClick={() => handleRenameClick(renamingMapping[selected])}
                                                    
                                                >
                                                    {renamingMapping[selected] || selected || selected.name}{' '}
                                                </Typography>
                                                {equipmentId === null &&  <FontAwesomeIcon icon={faSquareXmark} onClick={() => handleRemoveClick(selected)}/>}
                                               
                                            </div>
                                        ))}
                                        {(renameField && equipmentId === null) && 
                                        <TextField className='asset-list-rename' placeholder='Rename' value={renamedValue} onChange={(e) => setRenamedValue(e.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end"><DoneOutlinedIcon className='icon-search' onClick={handleDoneClick} />  </InputAdornment>
                                                ),
                                            }} />
                                        }
                                    </Box>
                                </div>
                            )}
                        </Box>
                        <Box className='hierarchy-sub-menu'>
                            <Box className='hierarchy-title-checkbox'>
                                <FormControlLabel
                                    control={<Checkbox checked={isParameterboxChecked} onChange={handleParameterboxChange} />} label="Add Parameter"
                                />
                                {(equipmentId !== null && isParameterboxChecked) &&
                                <Card className='card-param-icon'><FontAwesomeIcon icon={faPlus} className='icon' onClick={handleAddParameterEquipment}/> </Card> }
                            </Box>
                            {isParameterboxChecked && (
                                <div className='flex-parameter-add'>
                                    <div className='equipment-add-parameter'>
                                        <Box className='parameter-hierarchy'>
                                            <div className='parameter-hierarchy-flex'>
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Global Name</Typography>
                                                    <TextField className='parameter-text' placeholder='Enter the Code' value={globalCode} onChange={(e) => setGlobalCode(e.target.value)} />
                                                    {globalCodeError && <div className="error-message">{globalCodeError}</div>}
                                                </div>
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Parameter Name</Typography>
                                                    <TextField className='parameter-text' placeholder='Enter the Name' value={parameterName} onChange={(e) => setParameterName(e.target.value)} />
                                                    {parameterNameError && <div className="error-message">{parameterNameError}</div>}
                                                </div>
                                            </div>
                                            <div className='parameter-unit'>
                                                <Typography className='parameter-label'>Unit of Measure</Typography>
                                                <select className="custom-subselect" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                                                    <option value="0" disabled>---select---</option>
                                                    {unitOptions.map((option, index) => (
                                                        <option key={index} value={option.id} >
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Box>
                                        <Box className='parameter-description'>
                                            <Typography className='parameter-label'>Description</Typography>
                                            <Textarea className='parameter-text' placeholder='Enter the Description' value={parameterDescription} onChange={(e) => setParameterDescription(e.target.value)} />
                                        </Box>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <div className='parameter-category-flex'>
                                            <div className='parameter-label-flex'>
                                                <Typography className='parameter-label'>Category</Typography>
                                                <select className="custom-subselect" value={selectedCategory} onChange={handleCategoryChange}>
                                                    <option value="0" disabled>---select---</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>{category.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {(selectedCategory==2) &&
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Type of Aggregated Parameter</Typography>
                                                    <select className="custom-subselect" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                                        <option value="0" disabled>---select---</option>
                                                        {timeOptions.map((option, index) => (
                                                            <option key={index} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                             {(selectedCategory==2) &&
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Type of Aggregation</Typography>
                                                    <select className="custom-subselect" value={selectedAggregation} onChange={(e) => setSelectedAggregation(e.target.value)}>
                                                    <option value="0" disabled>---select---</option>
                                                    {aggregationOptions.map((option, index) => (
                                                        <option key={index} value={option.id} >
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                </div>
                                            }
                                             {(selectedCategory==2) &&
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Aggregation Base Parameter</Typography>
                                                    <select className="custom-subselect" value={selectedAggregationParameter} onChange={(e) => setSelectedAggregationParameter(e.target.value)}>
                                                    <option value="0" disabled>---select---</option>
                                                    {aggregationParameterOption.map((option, index) => (
                                                        <option key={index} value={option.id} >
                                                            {option.value}
                                                        </option>
                                                    ))}
                                                </select>
                                                </div>
                                            }
                                            {(selectedCategory == 1) &&
                                                <div className='parameter-label-flex'>
                                                    <Typography className='parameter-label'>Type of External Parameter</Typography>
                                                    <select className="custom-subselect" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                                        <option value="0" disabled>---select---</option>
                                                        {timeOptions.map((option, index) => (
                                                            <option key={index} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                        </div>
                                        <div className='parameter-value-select'>
                                            <div className='parameter-label-flex'>
                                                <Typography className='parameter-label'>Type Of Parameter</Typography>
                                                <select className="custom-subselect" value={selectedParameter} onChange={handleParameterChange}>
                                                    <option value="0" disabled>---select---</option>
                                                    {options.map(option => (
                                                        <option key={option.id} value={option.id}>{option.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='parameter-max-select'>
                                                <div className='parameter-label-flex-min'>
                                                    <Typography className='parameter-label'>Minimum Value</Typography>
                                                    <TextField className='parameter-text' placeholder='Enter' value={minValue} onChange={(e) => setMinValue(e.target.value.replace(/[^0-9.]/g, ''))} />
                                                </div>
                                                <div className='parameter-label-flex-min'>
                                                    <Typography className='parameter-label'>Maximum Value</Typography>
                                                    <TextField className='parameter-text' placeholder='Enter' value={maxValue} onChange={(e) => setMaxValue(e.target.value.replace(/[^0-9.]/g, ''))} />
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>                                 
                                </div>
                            )}
                        </Box>
                    </div>
                    <Box className='hierarchy-footer'>
                        <Button className='hierarchy-clear-btn hierarchy-btn-btn' onClick={handleClear}>Clear</Button>
                            {(equipmentId ===null && !paramEquip )&&
                            <>
                        {(isEditing  )? (
                            <Button className='hierarchy-add-btn hierarchy-btn-btn' onClick={handleAddButtonClick}>Update</Button>
                        ) : (
                            <Button className='hierarchy-add-btn hierarchy-btn-btn' onClick={handleAddButtonClick}>Add</Button>
                        )}
                        </>
                    }
                     {equipmentId !== null && 
                     <>
                     <Button className='hierarchy-add-btn hierarchy-btn-btn' onClick={handleEquipmentDone}>Finish</Button></>
                        }
                        {(paramEquip ) && 
                     <>
                     <Button className='hierarchy-add-btn hierarchy-btn-btn' onClick={handleAddParameterEquipment}>Update</Button></>
                        }
                    </Box>
                </Box>
            }
            {showDeleteConfirmation&& <DeleteDialog Cancel={handleDeleteCancel} Confirm={handleDeleteConfirm} show={showDeleteConfirmation}/>}
            {upload && <Upload onClose={() => setUpload(false)} />}
        </div>
    );
}
