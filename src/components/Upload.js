import React, { useState } from "react";
import { Modal, Button } from "antd";
import * as XLSX from "xlsx";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const Upload = ({ setNewData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  let r = Math.random().toString(36).substring(7);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [data, setData] = useState([]);

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    console.log(list);
    setData(list);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleClick = async () => {
    console.log(data);
    await axios.post("https://salty-tor-91350.herokuapp.com/api/countries", {
      countries: data,
    });
    setNewData(r);
    handleOk();
  };

  return (
    <React.Fragment>
      <Button type="primary" onClick={showModal}>
        Reset & Upload CSV
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>You will be able to upload a new csv file</p>
        <p>**WARNING** It will override the previous data</p>
        <p>Click Upload button after choosing the file</p>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
        <Button
          type="primary"
          shape="round"
          icon={<UploadOutlined />}
          size="large"
          onClick={handleClick}
        />
      </Modal>
    </React.Fragment>
  );
};

export default Upload;
