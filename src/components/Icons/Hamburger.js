export const IconHamburger = ({ lightTheme }) => {
    return (
        <svg width="22" height="13" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.0659179 10.8721L0.065918 12.8062L22 12.8062L22 10.8721L0.0659179 10.8721Z" fill={!lightTheme ? '#ffffff' : 'var(--colour-blue-02)'}/>
        <path d="M0.0659179 5.7144L0.065918 7.64844L22 7.64844L22 5.7144L0.0659179 5.7144Z" fill={!lightTheme ? '#ffffff' : 'var(--colour-blue-02)'}/>
        <path d="M0.0659179 0.556686L0.065918 2.49072L22 2.49072L22 0.556685L0.0659179 0.556686Z" fill={!lightTheme ? '#ffffff' : 'var(--colour-blue-02)'}/>
        </svg>
    )
}

export const IconClose = () => {
    return (
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.107 1.39648L2.06006 16.4435M2.06007 1.39648L17.1071 16.4435" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}