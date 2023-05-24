import React from "react";
export class ErrorsCatcher extends React.Component {
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
            return (<h1 className='center'>Что то пошло не так.</h1>);
        }
        return this.props.children;
    }
}
