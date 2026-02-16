import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchOpen: false,
      searchValue: "",
      stockData: null,
      loading: false,
      error: null
    };

    this.searchRef = createRef();
  }

  /* ================= Search Toggle ================= */

  handleSearchToggle = () => {
    this.setState(
      (prevState) => ({
        isSearchOpen: !prevState.isSearchOpen
      }),
      () => {
        if (this.state.isSearchOpen && this.searchRef.current) {
          this.searchRef.current.focus();
        }
      }
    );
  };

  handleInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  /* ================= API CALL ================= */

  fetchStockData = async () => {
    const { searchValue } = this.state;

    if (!searchValue.trim()) return;

    try {
      this.setState({
        loading: true,
        error: null,
        stockData: null
      });

      const response = await fetch(
        `https://backtest-production-dd36.up.railway.app/predict/${searchValue.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error("Stock not found");
      }

      const data = await response.json();

      this.setState({
        stockData: data,
        loading: false
      });

    } catch (err) {
      this.setState({
        error: err.message,
        loading: false
      });
    }
  };

  /* ================= RENDER ================= */

  render() {
    const {
      isSearchOpen,
      searchValue,
      stockData,
      loading,
      error
    } = this.state;

    const alpha =
      stockData &&
      (
        stockData.model_strategy_return_percent -
        stockData.buy_and_hold_return_percent
      ).toFixed(2);

    return (
      <div className="Dashboard">

        {/* ================= Header Row ================= */}
        <div className="HeaderRow">
          <div className={`SearchWrapper ${isSearchOpen ? "open" : ""}`}>

            <input
              ref={this.searchRef}
              className="SearchInput"
              type="text"
              placeholder="Search company (e.g. AAPL)"
              value={searchValue}
              onChange={this.handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.fetchStockData();
                }
              }}
            />

            <div
              className="SearchIconInside"
              onClick={this.fetchStockData}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>

          </div>
        </div>


        {/* ================= Loading State ================= */}
        {loading && (
          <div className="PerformanceCard">
            Loading data...
          </div>
        )}


        {/* ================= Error State ================= */}
        {error && (
          <div className="PerformanceCard">
            {error}
          </div>
        )}


        {/* ================= Performance Card ================= */}
        {stockData && (
          <div className="PerformanceCard">

            <div className="CardHeader">
              <div className="TickerBlock">
                <span className="TickerSymbol">
                  {stockData.ticker}
                </span>

                <span className={`RegimeTag ${stockData.latest_regime}`}>
                  {stockData.latest_regime}
                </span>
              </div>

              <div className="PriceBlock">
                ${stockData.latest_price}
              </div>
            </div>


            <div className="PerformanceRow">

              <div className="Metric">
                <div className="MetricLabel">Buy & Hold</div>
                <div className="MetricValue positive">
                  {stockData.buy_and_hold_return_percent}%
                </div>
              </div>

              <div className="Metric">
                <div className="MetricLabel">Model Strategy</div>
                <div className="MetricValue positive">
                  {stockData.model_strategy_return_percent}%
                </div>
              </div>

              <div className="Metric">
                <div className="MetricLabel">Alpha</div>
                <div
                  className={`MetricValue ${
                    alpha >= 0 ? "positive" : "negative"
                  }`}
                >
                  {alpha}%
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    );
  }
}

export default Dashboard;
