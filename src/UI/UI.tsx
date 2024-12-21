import styles from "@/UI/UI.module.scss";


const UI = () => {
    const isAiming = false

    return (
        <div className="ui-root">
            {!isAiming && <div className={styles.aim} />}
        </div>
    );
};

export default UI;