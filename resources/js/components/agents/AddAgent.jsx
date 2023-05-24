import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '../dummyComponents/CustomModal';
import ButtonInForm from '../dummyComponents/ButtonInForm';
import { setloading } from '../../store/global';
import Agent from "./Agent";
import {CreateAgentDispatcher} from "../../store/Dispatchers/Agent/CreateAgentDispatcher";

const AddAgent = ({show, setShow, setUpdate}) => {
    const [address, setAddress] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useRef();
    const [isDefaultAgent, setIsDefaultAgent] = useState(false);
    const [noShowGroup, setNoShowGroup] = useState(false);

    const formHandler = async (ev) => {
        ev.preventDefault();
        const dispatcher = new CreateAgentDispatcher(setError, setLoading, form, setShow);
        dispatcher.addData('no_show_group', noShowGroup);
        dispatcher.addData('is_default', isDefaultAgent);
        dispatcher.addData('address', address);
        dispatcher.addNoReqData('update', setUpdate);
        await dispatcher.handle();
    }

    useEffect(()=>{
        return ()=> {
            setIsDefaultAgent(false);
            setNoShowGroup(false);
            setError(false);
            setloading(false);
        }
    }, [])

    return (
        <div>
            <form onSubmit={formHandler} ref={form}>
                <CustomModal show={show} setShow={setShow} customStyles={{width: '500px'}}>
                    <div className="header_small">Добавление представителя</div>
                    <Agent setDefaultAgent={setIsDefaultAgent} setAddressForDB={setAddress}  setNoShowGroup={setNoShowGroup} />
                    <ButtonInForm loading={loading} />
                    <div className="error">{error}</div>
                </CustomModal>
            </form>
        </div>
    );
};

export default AddAgent;
