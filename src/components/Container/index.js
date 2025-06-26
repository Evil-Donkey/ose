const Container = ({ children, className, ref, id }) => {
    return (
        <div ref={ref} id={id} className={`container mx-auto px-4 md:px-10 lg:px-20 2xl:px-10 ${className ? className : ''}`}>
            {children}
        </div>
    )
}

export default Container;