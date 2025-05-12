const Container = ({ children, className, ref }) => {
    return (
        <div ref={ref} className={`container mx-auto px-4 md:px-10 lg:px-20 2xl:px-10 ${className}`}>
            {children}
        </div>
    )
}

export default Container;