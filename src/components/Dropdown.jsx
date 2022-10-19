import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { faEarthAmerica, faEllipsis, faFlag, faLink, faTrashCan, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Dropdown = ({ PopoverBody, PopoverIcon }) => {
    return (
        <div>
            <OverlayTrigger rootClose={true} trigger="click" key={'bottom'} placement={'bottom'} overlay={
                <Popover className='dark' id={Date.now()} style={{ width: 300 }}>
                    <Popover.Body className={`hover`} >
                        <PopoverBody />
                    </Popover.Body>
                </Popover>
            }>
                <div className="btn">
                    <FontAwesomeIcon className='text' style={{ fontSize: 20 }} icon={faEllipsis} />
                </div>
            </OverlayTrigger>
        </div>
    );
}

export default Dropdown;
