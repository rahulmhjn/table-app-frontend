import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import "antd/dist/antd.css";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Upload from "./Upload";

const TableComponent = () => {
  const [NewData, setNewData] = useState();

  const [state, setState] = React.useState({
    searchText: "",
    searchedColumn: "",
  });

  const [TableData, setTableData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        "https://salty-tor-91350.herokuapp.com/api/countries"
      );

      console.log(result);
      setTableData(result.data);
    }

    fetchData();
  }, [NewData]);

  const searchInput = React.useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const [sort, setSort] = React.useState({
    filteredInfo: null,
    sortedInfo: null,
  });

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setSort({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  let { sortedInfo, filteredInfo } = sort;
  sortedInfo = sortedInfo || {};
  filteredInfo = filteredInfo || {};

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "30%",
      ...getColumnSearchProps("country"),
      sorter: (a, b) => a.country.localeCompare(b.country),
      sortOrder: sortedInfo.columnKey === "country" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Capital",
      dataIndex: "capital",
      key: "capital",
      width: "20%",
      ...getColumnSearchProps("capital"),
      sorter: (a, b) => a.capital.localeCompare(b.capital),
      sortOrder: sortedInfo.columnKey === "capital" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
      ...getColumnSearchProps("population"),
      sorter: (a, b) => Number(a.population) - Number(b.population),
      sortOrder: sortedInfo.columnKey === "population" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      ...getColumnSearchProps("language"),
      sorter: (a, b) => a.language.localeCompare(b.language),
      sortOrder: sortedInfo.columnKey === "language" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "President",
      dataIndex: "president",
      key: "president",
      ...getColumnSearchProps("president"),
      sorter: (a, b) => a.president.localeCompare(b.president),
      sortOrder: sortedInfo.columnKey === "president" && sortedInfo.order,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Upload setNewData={setNewData} />
        <Button type="primary">
          <a href="csv/file.xlsx" download>
            Download CSV
          </a>
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={TableData}
        onChange={handleChange}
        // pagination={false}
        // pageSizeOptions="[10, 20, 50, 100]"
        pagination={{
          pageSizeOptions: ["25", "50", "100", "500"],
          showSizeChanger: true,
          defaultPageSize: 25,
        }}
      />
      ;
    </div>
  );
};

export default TableComponent;
