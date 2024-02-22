import React, { useEffect, useState } from 'react'
import { PreAuthLayout } from '../layouts/PreAuthLayout'
import { WindowCard } from '../elements/WindowCard'
import getAge from '../../utils/getAge'
import { useDispatch, useSelector } from 'react-redux'
import { habilitiesThunk } from '../../store/slices/habilities.slice'
import Typewriter from "typewriter-effect";
import { BrushIcon, BtcIcon, DatabaseIcon, DeployedHistoryIcon, EthIcon, HappyIcon, LaptopCodeIcon, TaskAltIcon, WebIcon } from '../../../public/icons/Svg'
import { Title } from '../elements/Title'

export const Landing = () => {

    const { habilities, darkMode } = useSelector( (state) => state);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(habilitiesThunk())
    }, [])

    return (
        <PreAuthLayout className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-9 gap-4 md:overflow-hidden">
            <section className="col-span-1 md:col-span-2 flex flex-col items-center gap-4 overflow-auto">
                <div className="flex flex-col gap-4 w-full items-center">
                    <div className="aspect-square h-32 w-min rounded-full bg-[url(/img/avatar.jpg)] dark:bg-[url(/img/avatar.png)] bg-center bg-cover border border-light-primary-500 dark:border-dark-primary-500" />
                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold text-xl mb-2">Luis Daniel Rojas</h3>
                        <span className="text-xs dark:text-white/50">Fullstack Developer</span>
                        <span className="text-xs dark:text-white/50">UI/UX Designer</span>
                    </div>
                </div>
                <WindowCard title={`Languages`} className="flex flex-col gap-2">
                    <div className="flex justify-evenly gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="h-20 border flex flex-col justify-end border-light-primary-500 dark:border-dark-primary-500 relative">
                                <div className="h-full bg-light-primary-500 dark:bg-dark-primary-500" style={{ height: `100%` }} />
                            </div>
                            <span className="uppercase text-xs">Spanish</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="h-20 border flex flex-col justify-end border-light-primary-500 dark:border-dark-primary-500 relative">
                                <div className="h-full bg-light-primary-500 dark:bg-dark-primary-500" style={{ height: `50%` }} />
                            </div>
                            <span className="uppercase text-xs">English</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="h-20 border flex flex-col justify-end border-light-primary-500 dark:border-dark-primary-500 relative">
                                <div className="h-full bg-light-primary-500 dark:bg-dark-primary-500" style={{ height: `20%` }} />
                            </div>
                            <span className="uppercase text-xs">Russian</span>
                        </div>
                    </div>
                </WindowCard>
                <WindowCard className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-4 justify-between text-sm">
                        <span className="font-semibold">Residence:</span>
                        <span className="dark:text-white/50">Colombia</span>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-between text-sm">
                        <span className="font-semibold">City:</span>
                        <span className="dark:text-white/50">Bogota D.C</span>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-between text-sm">
                        <span className="font-semibold">Age:</span>
                        <span className="dark:text-white/50">{getAge('1997-11-22')}</span>
                    </div>
                </WindowCard>
                <WindowCard title={`Habilities`} className="flex flex-col gap-2">
                    {
                        habilities?.map(hability => (
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="font-semibold">{hability.name}</span>
                                    <span className="dark:text-white/50">{`${hability.percent}%`}</span>
                                </div>
                                <div className="dark:bg-black w-full h-2 border border-light-primary-500 dark:border-dark-primary-500">
                                    <div className="bg-light-primary-500 dark:bg-dark-primary-500 h-full" style={{ width: `${hability.percent}%` }}></div>
                                </div>
                            </div>
                        ))
                    }
                </WindowCard>
            </section>
            <section className="col-span-1 md:col-span-3 lg:col-span-7 flex flex-col gap-4 overflow-auto">
                <header className="clip-header bg-gradient-to-b from-transparent via-transparent to-light-primary-500 dark:to-dark-primary-500 p-[2px]">
                    <div className="flex flex-col flex-grow h-full clip-header gap-4 justify-between p-4 items-center text-center bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)]">
                        <h1 className="text-4xl font-victor-mono">Discover my Amazing Work!</h1>
                        <div className="font-cutive-mono dark:text-green-500 text-lg flex gap-1 pb-4">
                            <Typewriter
                                onInit={(typewriter)=> {
                                    typewriter
                                    .typeString("Welcome to my workspace!")
                                    .pauseFor(1000)
                                    .deleteAll()
                                    .typeString("Bienvenido a mi espacio de trabajo")
                                    .start();
                                }}
                            />
                        </div>
                    </div>
                </header>

                <nav className="flex flex-wrap gap-4 justify-between text-xl uppercase font-mono">
                    <div className="flex gap-2 items-center">
                        <span className="text-green-500 dark:text-dark-primary-500 font-bold">{`${getAge('2017-01-01')}+`}</span>
                        <span className="text-bold">Years Experience</span>
                        <DeployedHistoryIcon size={20} color={darkMode ? "#00ffff" : "#22c55e"}/>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="text-green-500 dark:text-dark-primary-500 font-bold">10+</span>
                        <span className="text-bold">Completed proyects</span>
                        <TaskAltIcon size={20} color={darkMode ? "#00ffff" : "#22c55e"}/>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="text-green-500 dark:text-dark-primary-500 font-bold">20+</span>
                        <span className="text-bold">Happy Customers</span>
                        <HappyIcon size={20} color={darkMode ? "#00ffff" : "#22c55e"}/>
                    </div>
                </nav>

                <WindowCard title={`About me`} className="flex flex-col gap-2 font-mono text-sm">
                    <p>I am a programming and data processing enthusiast, I studied computer engineering at the Alejandro Humboldt University in Caracas, Venezuela.</p>
                    <p>Among my most outstanding works are fullstack web development, pentesting, blockchain development and database management</p>
                    <p>I like solving problems and looking for solutions, that's why I decided to dedicate myself to this beautiful work.</p>
                </WindowCard>

                <div className="flex flex-col gap-4">
                    <Title text={'my services'} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <BtcIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">DApps</h1>
                            <p className="text-xs dark:text-white/50">Projects under the web3 system and implementation of transactions with cryptocurrencies.</p>
                        </div>

                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <EthIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">Smart Contracts</h1>
                            <p className="text-xs dark:text-white/50">Creation and deployment of smart contracts in solidity, ERC20 and ERC721 Tokens.</p>
                        </div>

                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <WebIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">Web development</h1>
                            <p className="text-xs dark:text-white/50">Front-end and back-end web development, login system and data management and more...</p>
                        </div>

                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <BrushIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">Web design</h1>
                            <p className="text-xs dark:text-white/50">Web user interface customized to suit the client under CSS3, Tailwind and Bootstrap.</p>
                        </div>

                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <DatabaseIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">DB Management</h1>
                            <p className="text-xs dark:text-white/50">Architecture design and management of MongoDB, PostgresSQL, MySQL and SQLServer databases.</p>
                        </div>

                        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
                            <LaptopCodeIcon size={40} color={darkMode ? "#00ffff" : "gray"} />
                            <h1 className="text-xl">Software development</h1>
                            <p className="text-xs dark:text-white/50">Design and development of cross-platform desktop applications.</p>
                        </div>
                    </div>
                </div>

            </section>
        </PreAuthLayout>
    )
    }
