import FileUploadIcon from "@mui/icons-material/FileUpload";
import React from "react";
import styles from "../../css/list.module.css";
const UploadButton = ({}) => <FileUploadIcon sx={{ color: 'black', width: '25px', height: '25px' }} className={styles.documents__uploadIcon + ' ' + styles.documents__icon}/>;
export default UploadButton;
