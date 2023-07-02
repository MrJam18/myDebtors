import { faFileCirclePlus, faFilter, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../../css/list.module.css';
const iconTypes = {
    circlePlus: faFileCirclePlus,
    userPlus: faUserPlus,
    filter: faFilter,
    plus: faPlus
};
const ToolbarButton = ({ onClick, iconName, title }) => {
    return (<button className={styles.buttonUtil} title={title} onClick={onClick}>
            {/*@ts-ignore*/}
            <FontAwesomeIcon icon={iconTypes[iconName]} className={styles.imgUtil}/>
        </button>);
};
export default ToolbarButton;
