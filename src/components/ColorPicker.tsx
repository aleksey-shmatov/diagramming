import React, { useState, useCallback } from 'react'
import { TwitterPicker } from 'react-color'

type Props = {
    color: string
    onChange: (color: string) => void
}

const styles = {
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    } as React.CSSProperties,
    popover: {
        position: 'absolute',
        zIndex: 2,
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
} as { [key: string]: React.CSSProperties }

export const ColorPicker = ({ color, onChange }: Props) => {
    const [display, setDisplay] = useState(false)
    const handleClick = useCallback(() => {
        setDisplay((display) => !display)
    }, [])
    const handleChange = useCallback(
        (color) => {
            onChange(color.hex)
            setDisplay(false)
        },
        [onChange]
    )
    return (
        <div>
            <div style={styles.swatch} onClick={handleClick}>
                <div style={{ ...styles.color, background: color }} />
            </div>
            {display ? (
                <div style={styles.popover}>
                    <div style={styles.cover} onClick={handleClick} />
                    <TwitterPicker
                        color={color}
                        onChangeComplete={handleChange}
                    />
                </div>
            ) : null}
        </div>
    )
}
