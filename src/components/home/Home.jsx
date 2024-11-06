import { Button, Card, CardContent, Grid, Typography, LinearProgress } from '@mui/material';
import './Home.scss';
import { faDollarSign, faUser, faTasks, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'rsuite';
import Column from 'rsuite/esm/Table/TableColumn';
import { Cell, HeaderCell } from 'rsuite-table';
import 'rsuite/dist/rsuite.min.css';
import React, { useContext, useEffect, useState } from "react";
import { GetDashboardDataUrl } from '../../Constant/urls/urls';
import { GetApi } from '../../hooks/Get/GetApi';
import MainContext from '../../context/MainContext';




const Home = () => {
  const { ShowNotification } = useContext(MainContext);
  const [dashboardData, setDashboardData] = useState({})

  const getDashboardData = async () => {
    try {
      const result = await GetApi(GetDashboardDataUrl);
      console.log("result=  = ", result);
      if (!result || typeof result.status === "undefined") {
        ShowNotification("error", "Network Error");
      } else if (result.status !== 200) {
       
        ShowNotification("error", result.data?.message || "An error occurred");
      } else{
        setDashboardData(result.data);
      }
     
    } catch (error) {
      console.error("getOrders Error:", error);
      ShowNotification("error", "An unexpected error occurred");
    }
  };

console.log("data",dashboardData);

const tableData  = dashboardData?.data

console.log("tabledata",tableData);


  useEffect(()=>{
    getDashboardData();
  },[])

  return (
    <div>
      <section>
        <Grid container spacing={3}>


          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Today Delivered</Typography>
                <Typography variant="h4">{dashboardData?.count?.today_delivered}</Typography>
               
                <FontAwesomeIcon icon={faDollarSign} size="2x" className="dashboard-icon" style={{ color: '#FF7F7F' }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Today Order</Typography>
                <Typography variant="h4">{dashboardData?.count?.today_order}</Typography>
               
                <FontAwesomeIcon icon={faUser} size="2x" className="dashboard-icon" style={{ color: '#3EDCB5' }} />
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Today Pending</Typography>
                <Typography variant="h4">{dashboardData?.count?.today_pending}</Typography>
               
                <FontAwesomeIcon icon={faUser} size="2x" className="dashboard-icon" style={{ color: '#3EDCB5' }} />
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Total Order</Typography>
                <Typography variant="h4">{dashboardData?.count?.total_order}</Typography>
               
                <FontAwesomeIcon icon={faWallet} size="2x" className="dashboard-icon" style={{ color: '#937DFF' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Total Delivered</Typography>
                <Typography variant="h4">{dashboardData?.count?.total_delivered}</Typography>
               
                <FontAwesomeIcon icon={faWallet} size="2x" className="dashboard-icon" style={{ color: '#937DFF' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Total Pending</Typography>
                <Typography variant="h4">{dashboardData?.count?.total_pending}</Typography>
               
                <FontAwesomeIcon icon={faWallet} size="2x" className="dashboard-icon" style={{ color: '#937DFF' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Total Users</Typography>
                <Typography variant="h4">{dashboardData?.count?.total_users}</Typography>
               
                <FontAwesomeIcon icon={faWallet} size="2x" className="dashboard-icon" style={{ color: '#937DFF' }} />
              </CardContent>
            </Card>
          </Grid>





        </Grid>
      </section>
      <section style={{ marginTop: '30px' }}>
        <Table
          height={400}
          data={tableData}
          className="table-bordered"
          onRowClick={rowData => {
            console.log(rowData);
          }}
        >
          <Column flexGrow={1} align="center">
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              Id
            </HeaderCell>
            <Cell dataKey="recent_10_orders?.id" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              First Name
            </HeaderCell>
            <Cell dataKey="first_name" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              Last Name
            </HeaderCell>
            <Cell dataKey="last_name" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              Gender
            </HeaderCell>
            <Cell dataKey="gender" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              Age
            </HeaderCell>
            <Cell dataKey="age" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell style={{ backgroundColor: '#006ebb', color: '#fff', fontWeight: 'bold' }}>
              Action
            </HeaderCell>
            <Cell style={{ padding: '6px' }}>
              {rowData => (
                <Button appearance="link" onClick={() => alert(`id:${rowData.id}`)}>
                  Edit
                </Button>
              )}
            </Cell>
          </Column>

         
        </Table>
      </section>

    </div>
  );

};

export default Home;
