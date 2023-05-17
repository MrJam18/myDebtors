import React from "react";


export class ErrorsCatcher extends React.Component<any, any>
{
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error.message);
        console.error(errorInfo);
        console.dir(error);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<h1 className='center'>Something went wrong.</h1>);
        }
        return this.props.children;
    }
}