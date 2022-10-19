import React from 'react'
import { Button, Dropdown, Menu } from 'antd'


const DropdownFeed = () => {
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                            1st menu item
                        </a>
                    ),
                }
            ]}
        />
    )
    return (
       <></>
    )
}

export default DropdownFeed


