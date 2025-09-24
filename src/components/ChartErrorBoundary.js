import React from "react";

class ChartErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Chart Error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <div style={{ color: "red" }}>Chart failed to load.</div>;
        }
        return this.props.children;
    }
}

export default ChartErrorBoundary;
