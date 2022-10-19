import React, { useState } from 'react'
import Popover from '../Popover'
import { FaBell } from 'react-icons/fa'

const Menu = () => {
    const [open, setopen] = useState(false)

    const PopoverContent = () => {
        return (
            <div className='background' style={{ width: 350, height: 400 }}>
                GFDG
            </div>
        )
    }

    const handleopenChange = () => {
        setopen(!open)
    }

    return (
        <div className='Menu'>
            <div className="btn" onClick={() => setopen(!open)}>
                <Popover
                    children={<FaBell fontSize={20} className="pb-1" color="#A6A7AB" />}
                    width={350}
                    height={400}
                    PopoverContent={PopoverContent}
                    handleopenChange={handleopenChange}
                    open={open} />
            </div>
        </div>
    )
}


export default Menu