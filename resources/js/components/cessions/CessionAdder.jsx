import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {cessionsSelector} from "../../store/cessions/selectors";
import ChangerUI from "./UI/ChangerUI";
import {addCessionGroup} from "../../store/cessions/actions";


const CessionAdder = ({ setShow, update }) => {
 const dispatch = useDispatch();
 const info = useSelector(cessionsSelector.getInfo);
 const error = useSelector(cessionsSelector.selectInfoError);
 const activeCession = useSelector(cessionsSelector.selectActiveCession);
 const forceUpdate = useSelector(cessionsSelector.forceUpdate);

 const onSubmit = async (name, defaultCession) => {
  await dispatch(addCessionGroup(name, defaultCession));
  setShow(false);
  update();
 }

 return (
  <>
   <ChangerUI error={error} info={info} onSubmit={onSubmit} activeCession={activeCession} setShow={setShow} forceUpdate={forceUpdate} header='Добавление группы цессий' />
  </>
 );
};

export default CessionAdder;