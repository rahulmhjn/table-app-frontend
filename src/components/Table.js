import React from "react";
import { Table, Input, Button, Space } from "antd";
import "antd/dist/antd.css";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const TableComponent = () => {
  const data = [
    {
      key: "1",
      country: "India",
      capital: "Delhi",
      population: 1001111,
      language: "Hindi",
      president: "Ram Nath Kovind",
    },
    {
      key: "2",
      country: "UK",
      capital: "London",
      population: 122,
      language: "English",
      president: "Shyam",
    },
    {
      key: "3",
      country: "Australia",
      capital: "Melbourne",
      population: 232323,
      language: "English",
      president: "Amit",
    },
    {
      key: "4",
      country: "USA",
      capital: "Washington D.C",
      population: 333636,
      language: "American-English",
      president: "Joe Biden",
    },
  ];

  const [state, setState] = React.useState({
    searchText: "",
    searchedColumn: "",
  });

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

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: "30%",
      ...getColumnSearchProps("country"),
    },
    {
      title: "Capital",
      dataIndex: "capital",
      key: "capital",
      width: "20%",
      ...getColumnSearchProps("capital"),
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
      ...getColumnSearchProps("population"),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      ...getColumnSearchProps("language"),
    },
    {
      title: "President",
      dataIndex: "president",
      key: "president",
      ...getColumnSearchProps("president"),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />;
    </div>
  );
};

export default TableComponent;
