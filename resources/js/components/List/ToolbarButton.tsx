import {
    faArrowDownAZ,
    faArrowUpAZ,
    faFileCirclePlus, faFilter, faPlus,
    faSortDown,
    faSortUp,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MouseEventHandler} from "react";
import styles from '../../css/list.module.css';
type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>,
    iconName: string,
    title: string
}
const iconTypes = {
    circlePlus: faFileCirclePlus,
    userPlus: faUserPlus,
    filter: faFilter,
    plus: faPlus
}

const ToolbarButton = ({onClick, iconName, title}: Props) => {
    return (
        <button className={styles.buttonUtil} title={title} onClick={onClick}>
            {/*@ts-ignore*/}
            <FontAwesomeIcon icon={iconTypes[iconName]} className={styles.imgUtil} />
        </button>
        );
}

export default ToolbarButton