import React from 'react';

const ToggleButton = (props) => {
    return (
        <div className="flex bg-gray-200 p-1 rounded-lg">
            <label className="flex-1 text-center cursor-pointer relative">
                <input
                    type="radio"
                    name="switchToggle"
                    value={props?.leftLabel}
                    onChange={props?.onToggle}
                    checked={'less-than' === props?.toggle}
                    className="sr-only peer"
                />
                <div className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm transition-all">
                    {props?.leftLabel}
                </div>
            </label>
            <label className="flex-1 text-center cursor-pointer relative">
                <input
                    type="radio"
                    name="switchToggle"
                    value={props?.rightLabel}
                    onChange={props?.onToggle}
                    checked={'greater-than' === props?.toggle}
                    className="sr-only peer"
                />
                <div className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm transition-all">
                    {props?.rightLabel}
                </div>
            </label>
        </div>
    );
};

export default ToggleButton;
