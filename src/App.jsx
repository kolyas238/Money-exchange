import {
  useState,
  useEffect
} from "react";

import './app.scss';

const Title = (props) => <h1>{props.text}</h1>;

const Buttons = ({ rates, selectFunc }) => {
  const valutes = Object.values(rates);
  const items = valutes.map((item, i) => {
    return (
      <button
        key={i}
        className="btn"
        id={item.CharCode}
        onClick={(e) => selectFunc(e)}
        title={item.Name}
      >
        {item.CharCode}
      </button>
    );
  });

  return <>{items}</>;
};

const CustomInput = ({ rates, setInput }) => {
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

  const labelsList = (arr) => {
    const valutes = Object.values(arr);
    const items = valutes.map((item, i) => {
      return (
        <>
          <input
            className="inputRadio"
            type="radio"
            id={item.CharCode}
            name="currency"
            onChange={(e) => radioHandler(e)}
            title={item.Name}
          />
          <label title={item.Name} htmlFor={item.CharCode}>
            {item.CharCode}
          </label>
        </>
      );
    });
    return <>{items}</>;
  };

  return (
    <div className="wrapper">
      <input
        type="number"
        className="input"
        placeholder="Enter amount"
        onChange={(e) => inputHandler(e)}
      />
      {labelsList(rates)}
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
        return data.Valute;
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
    const val = e.target.id;
    const curr = rates[val].Value;

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

    const aimCurr = e.target.id;
    const fromVal = rates[currency]?.Value;
    const toVal = rates[aimCurr]?.Value;

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
        <CustomInput rates={rates} setInput={setInputValue} />
      )}
      <div className="frame">
        <span className="typing-effect">
          You will get: <br />
          {change ? change : 0}
        </span>
      </div>
      <div className="btnsWrap">
        <Buttons rates={rates} selectFunc={selectFunc} />
      </div>
      <button className="btn btnLast" onClick={elemHandler}>
        CUSTOM VALUE
      </button>
    </div>
  );
};

export default App;