import React, { useContext } from 'react'
import { Popover } from 'antd'
import { MdArrowDropUp } from 'react-icons/md'
import { ThemeContex } from '../contexts/ThemeContext'


const PopoverContainer = ({ PopoverContent, handleopenChange, open, children, id }) => {
    const { theme } = useContext(ThemeContex)

    return (
        <div className='Popover'>
            <Popover id={`popover-${id}`}
                placement="bottom"
                trigger="click"
                open={open}
                onOpenChange={handleopenChange}
                style={{ background: "red" }}
                content={
                    <div className={`${theme} p-content`} style={{ borderColor: theme === "dark" ? "rgb(37, 38, 43)" : "white" }}>
                        <div className='p-arrow-box'>
                            <MdArrowDropUp className='p-arrow' style={{ fontSize: 50 }} color={theme === "dark" ? "#1A1B1E" : "white"} />
                        </div>
                        <div className='popover-body background' style={{ width: 300 }}>
                            <PopoverContent />
                        </div>
                    </div>
                } >
                {children}
            </Popover>
        </div>
    )
}

export default PopoverContainer
