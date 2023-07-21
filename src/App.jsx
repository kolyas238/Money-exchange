
import { useState, useEffect } from "react";
import './app.scss'

const Title = (props) => <h1>{props.text}</h1>;

const CustomInput = ({ state, setInput }) => {
    const inputHandler = (e) => {
        setInput((prevInputValue) => ({
            ...prevInputValue,
            inputVal: Number(e.target.value)
        }));
    };

    const radioHandler = (e) => {
        setInput((prevInputValue) => ({
            ...prevInputValue,
            currency: e.target.id
        }));
    };

    const curr = () => {
        const selectedRadio = document.querySelector(
            'input[name="currency"]:checked'
        );
        if (selectedRadio) {
            return selectedRadio.id;
        } else {
            return null;
        }
    };

    return (
        <div className="wrapper">
            <input
                type="number"
                className="input"
                placeholder="Enter amount"
                onChange={(e) => inputHandler(e)}
            />
            <input
                className="inputRadio"
                type="radio"
                id="GBP"
                name="currency"
                onChange={(e) => radioHandler(e)}
            />
            <label tabIndex="1" htmlFor="GBP">GBP</label>
            <input
                className="inputRadio"
                type="radio"
                id="GEL"
                name="currency"
                onChange={(e) => radioHandler(e)}
            />
            <label tabIndex="1" htmlFor="GEL">GEL</label>
            <input
                className="inputRadio"
                type="radio"
                id="EUR"
                name="currency"
                onChange={(e) => radioHandler(e)}
            />
            <label tabIndex="1" htmlFor="EUR">EUR</label>
            <input
                className="inputRadio"
                type="radio"
                id="USD"
                name="currency"
                onChange={(e) => radioHandler(e)}
            />
            <label tabIndex="1" htmlFor="USD">USD</label>
        </div>
    );
};

const App = ({ amount }) => {
    const [rates, setRates] = useState("");
    const [change, setChange] = useState("");
    const [elem, setElem] = useState(false);
    const [inputValue, setInputValue] = useState({
        inputVal: 0,
        currency: null
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    "https://www.cbr-xml-daily.ru/daily_json.js"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(error);
                return null;
            }
        };
        getData().then((data) => {
            setRates(data);
        });
    }, []);

    const getRate = (e, qty) => {
        const val = e.target.getAttribute("data-curr");
        const curr = rates.Valute[val].Value;
        setChange((qty / curr).toFixed(2) + " " + val);
    };

    const elemHandler = () => {
        setElem(!elem);
        setChange("");
    };

    const customValueHandler = (state, e) => {
        const { inputVal, currency } = state;

        if (!inputVal || !currency) {
            alert("Not enough data!");
            return null;
        }

        const aimCurr = e.target.getAttribute("data-curr");
        const fromVal = rates?.Valute?.[currency]?.Value;
        const toVal = rates?.Valute?.[aimCurr]?.Value;

        setChange(((inputVal * fromVal) / toVal).toFixed(2) + " " + aimCurr);
    };

    const selectFunc = (e) => {
        if (elem) {
            getRate(e, amount);
        } else {
            customValueHandler(inputValue, e);
        }
    };

    return (
        <div className="box">
            <Title text="Converter" />
            {elem ? (
                <span className="amount">{amount} RUB</span>
            ) : (
                <CustomInput state={inputValue} setInput={setInputValue} />
            )}
            <div className="frame">
                <span className="typing-effect">
                    You will get: <br />
                    {change ? change : 0}
                </span>
            </div>
            <button className="btn" data-curr="GBP" onClick={(e) => selectFunc(e)}>
                1 GBP: {rates.Valute?.GBP?.Value} RUB
            </button>
            <button className="btn" data-curr="GEL" onClick={(e) => selectFunc(e)}>
                1 GEL: {rates.Valute?.GEL?.Value} RUB
            </button>
            <button className="btn" data-curr="EUR" onClick={(e) => selectFunc(e)}>
                1 EUR: {rates.Valute?.EUR?.Value} RUB
            </button>
            <button className="btn" data-curr="USD" onClick={(e) => selectFunc(e)}>
                1 USD: {rates.Valute?.USD?.Value} RUB
            </button>
            <button className="btn" onClick={elemHandler}>
                CUSTOM VALUE
            </button>
        </div>
    );
};

export default App;