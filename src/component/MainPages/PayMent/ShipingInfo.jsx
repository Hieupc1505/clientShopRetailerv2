import React, { useState, useEffect } from 'react';
import address2 from '../helpers/address2';
import { v4 as uuid4 } from 'uuid';

const ShipingInfo = ({ name, number, address, notes }) => {
    const [store, setStore] = useState({
        name: '',
        number: '',
        address: '',
        notes: '',
        focus: false,
    });
    const [data, setData] = useState([]);
    const [flag, setFlag] = useState([false, false, false]);
    const { number, name, address, notes } = store;
    const ele = React.createRef();

    const handleChangeInput = (e) => {
        setStore(() => ({
            ...store,
            [e.target.name]: [e.target.value],
        }));
    };

    useEffect(() => {
        setData(address2);
    }, []);

    useEffect(() => {
        let ipTop = document.querySelectorAll('input.text-to-top'); //eff
        let textTop = document.querySelectorAll('.form-text-top'); // topcd

        Array.from(ipTop).map((eff) => {
            eff.addEventListener('focus', () => {
                if (eff.value === '') eff.previousElementSibling.style.animation = 'fade-up linear 0.2s forwards';

                eff.previousElementSibling.style.color = '#0d6efd';
            });

            eff.addEventListener('blur', () => {
                // let ele = eff.previousElementSibling.
                // topcd = document.querySelector(".form-text-top");
                let topcd = eff.previousElementSibling;
                topcd.setAttribute('style', 'color : #6c757d !important');
                if (eff.value === '') {
                    topcd.style.animation = '';
                    topcd.classList.remove('after-effect');
                } else if (eff.value !== '') {
                    topcd.classList.add('after-effect');
                }
            });
        });
        Array.from(textTop).map((topcd) => {
            let eff = topcd.nextElementSibling;
            topcd.addEventListener('click', () => {
                eff.focus();
            });
        });
        console.log(ele);
        ele.current.addEventListener('focus', function () {
            if (this.value === '') this.previousElementSibling.style.animation = 'fade-up linear 0.2s forwards';

            this.previousElementSibling.style.color = '#0d6efd';
        });
        ele.current.addEventListener('blur', function () {
            this.previousElementSibling.style.color = '#6c757d';
        });

        // if (flag.type === 'put' && flag.num === 0 && !loadUser) {
        //     let ipTop = document.querySelectorAll('input.text-to-top'); //eff
        //     let textTop = document.querySelectorAll('.form-text-top'); //
        //     for (let i = 0; i < textTop.length; i++) {
        //         textTop[i].classList.add('after-effect');
        //     }
        // }
    }, []);

    const handleItemClick = (e, index, current) => {
        const value = e.target.textContent;
        const lv = `level${current + 2}s`;

        current < 2 && setData(() => data[index][lv]);
        setStore(() => ({
            ...store,
            address: flag[0] === true ? `${value}` : `${address} - ${value}`,
        }));
        setFlag(() => flag.map((item, index) => (index === current + 1 && true) || false));
    };

    const handleInputAddressFocus = (e) => {
        setData(address2);
        setFlag(() => [true, false, false]);
    };
    const handleInputBlur = (e) => {
        setStore(() => ({ ...store, focus: true }));
    };

    const RenderAddress = (current) => {
        return data.map((item, index) => (
            <li
                className="list-group-item list-group-item-effect"
                key={uuid4()}
                onClick={(e) => handleItemClick(e, index, current)}
            >
                {item.name}
            </li>
        ));
    };

    return <></>;
};

export default ShipingInfo;
