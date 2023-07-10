import React , { useState } from "react";
import styles from "../../css/footer.module.css"
import {Link, NavLink} from "react-router-dom";


const Footer= () => {
    return (
 <div className={styles.background}>
     <div className={styles.footer + ' container'} >
         <div className={styles.footerBlock}>
             <p className={styles.element}><a className={styles.link} href="https://t.me/MrJam18">Telegram</a></p>
             <p className={styles.element + ' ' + styles.element_bottom}><a className={styles.link} href="mailto:admin@mydebtors.ru?subject=Обратная связь">admin@mydebtors.ru</a></p>
         </div>
         <div className={styles.footerBlock}>
             <p className={styles.element}>
                 <NavLink className={styles.link}  to="/privacy">Обработка персональных данных</NavLink>
             </p>
             <p className={styles.element + ' ' + styles.element_bottom}>
                 <NavLink className={styles.link} to="/terms" >Публичная оферта</NavLink>
             </p>
         </div>
         <div className={styles.footerBlock_end}>
             <p className={styles.element} >My Debtors</p>
             <p className={styles.element + ' ' + styles.element_bottom} >© 2023 Brand All Rights Reserved</p>
         </div>
     </div>
 </div>
    )          
};





export default Footer;





