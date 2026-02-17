import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: "",
      stockData: null,
      loading: false,
      error: null
    };

    this.searchRef = createRef();
  }

  handleInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };
renderCircle = (value) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // 👇 THIS is where you use it
  const normalized = Math.min(Math.abs(value), 100);
  const strokeDashoffset =
    circumference - (normalized / 100) * circumference;

  const color = value > 0 ? "#22c55e" : "#ef4444";

  return (
    <svg width="150" height="150">
      <circle
        cx="75"
        cy="75"
        r={radius}
        stroke="#1f2937"
        strokeWidth="12"
        fill="none"
      />
      <circle
        cx="75"
        cy="75"
        r={radius}
        stroke={color}
        strokeWidth="12"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 75 75)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#e5e7eb"
        fontSize="18"
        fontWeight="600"
      >
        {value.toFixed(2)}%
      </text>
    </svg>
  );
};

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

  render() {
    const { searchValue, stockData, loading, error } = this.state;

    const circumference = 2 * Math.PI * 38; // r = 38

    const alpha =
      stockData &&
      (
        stockData.model_strategy_return_percent -
        stockData.buy_and_hold_return_percent
      ).toFixed(2);

    return (
      <div className="Dashboard">

        {/* ================= Search Header ================= */}
        <div className="HeaderRow">
          <div className="SearchWrapper">

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


        {/* ================= Loading ================= */}
        {loading && (
          <div className="Box">Loading...</div>
        )}

        {/* ================= Error ================= */}
        {error && (
          <div className="Box">{error}</div>
        )}


        {/* ================= Performance Section ================= */}
        {stockData && (
          <div className="PerformanceSection Box">

            <div className="SectionTitleMain">
              PERFORMANCE SUMMARY
            </div>

            {/* Buy & Hold */}
            <div className="MetricRow">
              <div className="MetricLeft">
                <div className="MetricTitle">Buy & Hold</div>
                <div className="MetricSub">
                  Passive investment return
                </div>
              </div>

              <div className="MetricRight">
               <div className="MetricCircle">
  {this.renderCircle(
    stockData.buy_and_hold_return_percent
  )}
</div>

              </div>
            </div>


            {/* Model Strategy */}
            <div className="MetricRow">
              <div className="MetricLeft">
                <div className="MetricTitle">Model Strategy</div>
                <div className="MetricSub">
                  Regime-based trading system
                </div>
              </div>

              <div className="MetricRight">
                <div className="CircularProgressLarge">
                  <svg width="90" height="90">
                    <circle
                      className="ring-bg"
                      strokeWidth="8"
                      r="38"
                      cx="45"
                      cy="45"
                    />
                    <circle
                      className="ring-fill blue"
                      strokeWidth="8"
                      r="38"
                      cx="45"
                      cy="45"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset:
                          circumference -
                          (circumference *
                            stockData.model_strategy_return_percent) /
                            100
                      }}
                    />
                  </svg>

                  <div className="ring-text">
                    {stockData.model_strategy_return_percent}%
                  </div>
                </div>
              </div>
            </div>


            {/* Alpha */}
            <div className="MetricRow">
              <div className="MetricLeft">
                <div className="MetricTitle">Alpha</div>
                <div className="MetricSub">
                  Strategy vs passive
                </div>
              </div>

              <div className="MetricRight">
                <div
                  className={`AlphaValue ${
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
