import React, { useRef, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import Image from 'next/image';

function Characters({ info }) {
    const containerRef = useRef();
    const { events } = useDraggable(containerRef);
    const [isLeftArrowActive, setIsLeftArrowActive] = useState(false);
    const [isRightArrowActive, setIsRightArrowActive] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    function handleScroll() {
        const container = containerRef.current;
        const scrollPosition = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        setIsLeftArrowActive(scrollPosition > 30);
        setIsRightArrowActive(scrollPosition < maxScroll - 30);
    }

    const smoothScroll = (amount) => {
        const container = containerRef.current;
        const cont = document.getElementById("cardid");

        if (cont && container) {
            cont.classList.add('scroll-smooth');
            container.scrollLeft += amount;

            setTimeout(() => {
                cont.classList.remove('scroll-smooth');
            }, 300);
        }
    };

    function scrollLeft() {
        smoothScroll(-500);
    }

    function scrollRight() {
        smoothScroll(500);
    }

    return (
        <div className="animecard">
            <div className="relative animeitems">
                <span className={`leftarrow ${isLeftArrowActive ? '' : 'notactive'}`} onClick={scrollLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer"><path d="m15 18-6-6 6-6"></path></svg>
                </span>
                <span className={`rightarrow ${isRightArrowActive ? '' : 'notactive'}`} onClick={scrollRight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer"><path d="m9 18 6-6-6-6"></path></svg>
                </span>
                <div className="cardcontainer" id="cardid" {...events} ref={containerRef} onScroll={handleScroll}>
                    {info?.map((item, index) => (
                        <div className='carditem' key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="cardimgcontainer">
                                <Image
                                    className={`cardimage ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}
                                    src={item.node.image.large}
                                    alt={item.node.name.full}
                                    width={170}
                                    height={230}
                                />
                                <Image
                                    className="cardimage"
                                    src={item.voiceActorRoles[0]?.voiceActor?.image.large}
                                    alt={item.node.name.full}
                                    width={170}
                                    height={230}
                                />
                            </div>
                            <div className="p-2 absolute top-0 left-0 align-bottom flex flex-col-reverse w-full h-full bg-gradient-to-b from-transparent via-transparent to-black cardinfo">
                                <div className="font-medium text-xs opacity-80 text-white">{item.role}</div>
                                <div className="font-semibold text-white text-sm">
                                    {hoveredIndex === index ? item.voiceActorRoles[0]?.voiceActor?.name.full : item.node.name.full}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Characters;