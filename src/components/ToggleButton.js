import React, { useState } from 'react';

import './ToggleButton.scss';

const ToggleButton = (props) => {
    return (
        <form className="crypto-alert-toggle-switch">
            <input
                type="radio"
                id="switch_left"
                name="switchToggle"
                value={props?.leftLabel}
                onChange={props?.onToggle}
                checked={'less-than' === props?.toggle}
            />
            <label htmlFor="switch_left">{props?.leftLabel}</label>
            <input
                type="radio"
                id="switch_right"
                name="switchToggle"
                value={props?.rightLabel}
                onChange={props?.onToggle}
                checked={'greater-than' === props?.toggle}
            />
            <label htmlFor="switch_right">{props?.rightLabel}</label>
        </form>
    );
};

export default ToggleButton;
