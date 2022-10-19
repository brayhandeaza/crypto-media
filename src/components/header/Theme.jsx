import React from "react";

const Theme = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 400 400" >
            <g>
                <path
                    fillRule="evenodd"
                    stroke="none"
                    fill={color}
                    d="M181.641.868C33.413 18.582-44.211 186.966 38.52 311.328c89.637 134.746 297.445 111.03 353.962-40.395 6.747-18.078-2.373-26.972-19.056-18.584-46.479 23.37-99.744 14.351-134.728-22.812-56.531-60.053-32.069-157.904 46.18-184.722 14.472-4.959 18.464-10.922 13.375-19.976C294.441 18.057 264.414 6.9 237.5 2.265 226.366.347 192.985-.487 181.641.868"
                ></path>
            </g>
        </svg>
    );
}

export default Theme