import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = ({ data, options, type = "bar" }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Default data if none provided
    const defaultData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                label: "Users",
                data: [100, 200, 150, 300, 250],
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(75,192,192,0.8)");
                    gradient.addColorStop(1, "rgba(75,192,192,0.2)");
                    return gradient;
                },
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                borderRadius: 10, // Rounded bars
            },
        ],
    };

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Fancy Analytics Chart",
                font: { size: 20 },
            },
            tooltip: { enabled: true },
        },
        animation: {
            duration: 1200,
            easing: "easeOutBounce",
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 50 },
            },
        },
    };

    useEffect(() => {
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(chartRef.current, {
            type,
            data: data || defaultData,
            options: options || defaultOptions,
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [data, options, type]);

    return <canvas ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default ChartComponent;
