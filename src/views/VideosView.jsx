import React, { useRef } from 'react';
import videos from "../videos.json"
import { FaMars } from "react-icons/fa"
import { MdOutlineWidgets, MdLocalFireDepartment } from "react-icons/md"
import Hentai from "../assets/anime.png"
import Transgender from "../assets/transgender.png"

const VideosView = () => {
    const ref = useRef()

    const thumbs = [
        {
            title: "Category",
            icon: <MdOutlineWidgets fontSize={20} />
        },
        {
            title: "Tranding Videos",
            icon: <MdLocalFireDepartment fontSize={20} />
        },
        {
            title: "Gay",
            icon: <FaMars fontSize={18} />
        },
        {
            title: "Heintai",
            icon: <img style={{ width: 18, height: 18 }} src={Hentai} />
        },
        {
            title: "Transgender",
            icon: <img style={{ width: 18, height: 18 }} src={Transgender} />
        },
        {
            title: "Category",
            icon: <MdOutlineWidgets fontSize={18} />
        },
        {
            title: "Gay",
            icon: <FaMars fontSize={18} />
        }
    ]

    const onMouseEnter = (key) => {
        const video = document.getElementById(`video-preview-${key}`)
        video.play()
    }

    const onMouseLeave = (key) => {
        const video = document.getElementById(`video-preview-${key}`)
        video.pause()
    }

    return (
        <div className={`VideosView`}>
            <div className='background categories-wrap mt-1'>
                <div className="container categories">
                    {thumbs.map((category, key) => (
                        <div key={key} className='category text'>
                            {category.icon}
                            <span className='ms-2'>{category.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="videos mt-3">
                {videos.data.map((video, key) => (
                    <div key={key} className="video">
                        <video
                            poster={video.default_thumb_url}
                            onMouseEnter={() => onMouseEnter(video.source_id)}
                            onMouseLeave={() => onMouseLeave(video.source_id)}
                            id={`video-preview-${video.source_id}`}
                            src={video.preview_url}
                            ref={ref}
                            muted
                            loop
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideosView
