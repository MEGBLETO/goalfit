"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { useState } from 'react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend);

export default function Home() {

  const gradient = (ctx) => {
    if (!ctx?.chart?.ctx) return;
    const gradientStroke = ctx.chart.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke.addColorStop(0, 'rgba(94, 114, 228, 0)');
    return gradientStroke;
  };

  const data = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Mobile apps",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
        borderColor: "#fbfbfb",
        backgroundColor: (ctx) => gradient(ctx),
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#fbfbfb',
        pointBorderColor: '#1c64f2',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: '#fbfbfb',
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: '#fbfbfb',
          padding: 20,
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className='min-h-fit'>
      <div className="w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-md bg-white flex flex-col lg:flex-row items-center justify-between px-10 py-4 my-8 md:py-6 xl:py-8 dark:bg-gray-800">
            <div className="w-full lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
              <h2 className="font-manrope text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center lg:text-left dark:text-gray-400">
                Consommation du jour
              </h2>
            </div>
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:ml-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="block shrink">
                  <div className="font-manrope font-bold text-2xl md:text-3xl lg:text-4xl text-blue-600 mb-3 text-center lg:text-left">
                    100<span className="text-lg">g</span>
                  </div>
                  <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400">
                    Protéines
                  </span>
                </div>
                <div className="block shrink">
                  <div className="font-manrope font-bold text-2xl md:text-3xl lg:text-4xl text-blue-600 mb-3 text-center lg:text-left">
                    250<span className="text-lg">g</span>
                  </div>
                  <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400">
                    Glucides
                  </span>
                </div>
                <div className="block shrink">
                  <div className="font-manrope font-bold text-2xl md:text-3xl lg:text-4xl text-blue-600 mb-3 text-center lg:text-left">
                    70<span className="text-lg">g</span>
                  </div>
                  <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400">
                    Lipides
                  </span>
                </div>
                <div className="block shrink">
                  <div className="font-manrope font-bold text-2xl md:text-3xl lg:text-4xl text-blue-600 mb-3 text-center lg:text-left">
                    2000
                  </div>
                  <span className="text-gray-900 text-center block lg:text-left dark:text-gray-400">
                    Total de Calories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* cards row 2 */}
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full mt-0 lg:col-span-3">
          <div className="relative flex flex-col min-w-0 break-words bg-blue-600 text-white dark:bg-slate-850 border-0 bg-clip-border z-20 rounded-2xl">
            <div className="p-6 pt-4 pb-0 border-b-0 rounded-t-2xl mb-0 border-black/12.5">
              <h5 className="font-semibold text-2xl">Objectif de poids</h5>
              <div className="p-4 flex justify-between items-center max-w-md">
                <div className="text-center">
                  <div className="text-xl font-bold">87 <span className="text-sm">kg</span></div>
                  <div className="text-sm">Actuel</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">95 <span className="text-sm">kg</span></div>
                  <div className="text-sm">Objectif</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">23 <span className="text-sm">%</span></div>
                  <div className="text-sm">Progrès</div>
                </div>
              </div>
            </div>
            <div className="flex-auto p-4">
              <div>
                <Line options={options} data={data} height="300" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full mt-6 lg:mt-0 min-h-[300px] lg:col-span-2">
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <a href="#" className="group relative block h-full">
              <div className="relative h-full">
                <img
                  src="https://images.pexels.com/photos/5894142/pexels-photo-5894142.jpeg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                <div className="relative inline-block text-xl font-bold text-transparent">
                  <span className="absolute inset-0 text-black stroke-text">Salade de poulet grillé</span>
                  <span className="relative text-white">Salade de poulet grillé</span>
                </div>

                <span
                  className="mt-3 bg-blue-600 px-5 py-3 text-xs rounded-lg font-medium uppercase tracking-wide text-white flex items-center"
                >
                  <span className="mr-2">Voir plus</span>
                  <svg className="transition-all duration-500 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.25 9L14.25 9M10.5 13.5L14.4697 9.53033C14.7197 9.28033 14.8447 9.15533 14.8447 9C14.8447 8.84467 14.7197 8.71967 14.4697 8.46967L10.5 4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
