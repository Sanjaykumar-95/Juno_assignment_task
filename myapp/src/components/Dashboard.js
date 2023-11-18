import React, { useState, useEffect } from 'react';
import { RxCrossCircled, RxDotFilled } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";

function Dashboard() {

    const [precords, setPrecords] = useState([]);
    const [crecords, setCrecords] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [recordsp, setRecordsp] = useState([]);
    const [recordsc, setRecordsc] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [isPopupVisible, setPopupVisible] = useState(false);

    // Fetching Pending Data from JSON file
    useEffect(() => {
        fetch('https://juno-task-fe-role.netlify.app/pendingdata.json')
          .then(res => res.json())
          .then(data => {
            setPrecords(data);
            setRecordsp(data);
          })
          .catch(err => console.error('Error fetching pending data:', err));
      }, []);

    // Fetching Completed Data from JSON file
      useEffect(() => {
        fetch('https://juno-task-fe-role.netlify.app/completeddata.json')
          .then(res => res.json())
          .then(data => {
            setCrecords(data);
            setRecordsc(data);
          })
          .catch(err => console.error('Error fetching pending data:', err));
      }, []);

    //   Tab change function
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    //   Risk level color function
    const getRiskLevelStyle = (riskLevel) => {
        switch (riskLevel.toLowerCase()) {
          case 'low':
            return { color: '#006540' };
          case 'medium':
            return { color: '#88670F' };
          case 'high':
            return { color: '#7D2424' };
          default:
            return {};
        }
      };

        // Search filter function for Pending Tab
      const Pfilter = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        if(searchQuery === '') setRecordsp(precords);

        else if (Array.isArray(precords)) {
            setRecordsp(precords.filter(f => f.user.toLowerCase().includes(event.target.value.toLowerCase())));
        }
      };

        // Search filter function for Completed Tab
      const Cfilter = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        if(searchQuery === '') setRecordsc(crecords);

        else if (Array.isArray(crecords)) {
            setRecordsc(crecords.filter(f => f.user.toLowerCase().includes(event.target.value.toLowerCase())));
        }
      };

        // Sorting function
      const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
        }
        setSortConfig({ key, direction });
      };
    
      const sortedRecords = (records, key, direction) => {
        const copyRecords = [...records];
        const compareFunction = (a, b) => {
          if (a[key] < b[key]) {
            return direction === 'asc' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        };
        return copyRecords.sort(compareFunction);
      };
    
      const getSortedRecords = () => {
        const { key, direction } = sortConfig;
        if (activeTab === 'pending') {
          return sortedRecords(recordsp, key, direction);
        } 
        else if (activeTab === 'completed') {
          return sortedRecords(recordsc, key, direction);
        }
        return [];
      };

        // Rendering table rows
      const renderTableRows = (records) => {
        return records.map((d, i) => (
          <tr key={i}>
            <td>
              <span>{d.user}</span> <br />
              <span style={{ color: 'grey', fontSize: '12px' }}>{d.email}</span>
            </td>
            <td style={getRiskLevelStyle(d.risklevel)}>
              <RxDotFilled />
              {d.risklevel}
            </td>
            <td>{d.triggerreason || d.actionreason}</td>
            <td>{d.inqueuefor || d.timetoclose}</td>
            <td style={{ color: 'grey' }}>{d.dateaddedon}</td>
            <td>
                <span>{d.previouslyreviewed || d.actiontakenby}</span>
                <br />
                <span style={{ color: 'grey', fontSize: '12px' }}>{d.reviewedDate || d.actionmail}</span>
            </td>
          </tr>
        ));
      };

  return (
    <div className="container-fluid">
      <div className="row" style={{ marginTop: '10px' }}>

        {/* Left side */}
        <div className="col-md-3" style={{ padding: '98px',paddingBottom:'0'}}>
          
            {/* Logo */}
          <div className="logo">LOGO HERE</div>

          {/* Menu */}
          <div className="menu">
            <ul>
              <li>Overview</li>
              <li>Onboarding</li>
              <li className="menu-active">Monitoring</li>
              <li>Flagging</li>
              <li>Source of Income</li>
              <li>UAR</li>
            </ul>
          </div>

          {/* Candidate Profile */}
          <div className="profile">
            <div className="profile-info">
                <div className='profile-photo'>
                    <FaUserCircle />
                </div>
                <div className='about-profile'>
                    <span style={{fontWeight:'500'}}>Elon Musk</span><br></br>
                    <span style={{color:'grey',fontSize:'14px'}}>elon@twitter.com</span>
                </div>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="col-md-9" style={{ padding: '15px' }}>
          <div className="page-title">
            <h2>Monitoring</h2>
          </div>

          <div className="tab-sec">
            
            {/* Tab section shifting tabs*/}
            <div className="tab-section">
              <ul>
                <li className={activeTab === 'pending' ? 'active' : ''} onClick={() => handleTabChange('pending')}>Pending</li>
                <li className={activeTab === 'completed' ? 'active' : ''} onClick={() => handleTabChange('completed')}>Completed</li>
              </ul>

              {/* Close button */}
              <span style={{cursor:'pointer'}} onClick={() => setPopupVisible(!isPopupVisible)}>
                    <RxCrossCircled />
                    Close account
              </span>

            </div>

            {/* Tabs body */}
            <div className="tabs-body">

                {/* pending tab */}
                <div className={`pending ${activeTab === 'pending' ? 'active' : ''}`}>
                <div className="tabs-body-filters">
                    <div className="row">
                        {/* Search Input*/}
                        <div className="col-md-3">
                            <input type="search" className="form-control" placeholder="Pending search User" onChange={Pfilter} />
                        </div>

                        {/* Dropdowns */}
                        <div className="col-md-2 select-with-arrow">
                            <select className="form-control dropdowns Reasons" name="Reasons" id="Reasons">
                                <option value="">Trigger Reason</option>
                                <option value="hard-flag">Hard flag</option>
                                <option value="temp-flag">Temp flag</option>
                                <option value="restricted-unflag">Restricted unflag</option>
                                <option value="unflag">Un flag</option>
                                <option value="reviewed">Reviewed</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select className="form-control dropdowns Risk-levels" name="Risks" id="Risks">
                                <option value="">Risk level</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/*Pending Table */}
                <div className="tabs-body-table table-responsive">
                    <table border={1} className="table tab table-rounded">
                        <thead className="table-secondary">
                        <tr>
                            <th>User</th>
                            <th onClick={() => handleSort('risklevel')} style={{cursor:'pointer'}}>Risk level</th>
                            <th>Trigger reason</th>
                            <th onClick={() => handleSort('inqueuefor')} style={{cursor:'pointer'}}>In queue for</th>
                            <th onClick={() => handleSort('dateaddedon')} style={{cursor:'pointer'}}>Date added on</th>
                            <th>Previously reviewed</th>
                        </tr>
                        </thead>
                        <tbody style={{ fontWeight: '500' }}>{renderTableRows(getSortedRecords())}</tbody>
                    </table>

                </div>
              </div>

              
              {/* completed tab */}
              <div className={`completed ${activeTab === 'completed' ? 'active' : ''}`}>
                <div className="tabs-body-filters">
                <div className="row">
                    {/* Search Input */}
                        <div className="col-md-3">
                            <input type="search" className="form-control" placeholder="Completed search User" onChange={Cfilter}/>
                        </div>

                        {/* Dropdowns */}
                        <div className="col-md-2 select-with-arrow">
                            <select className="form-control dropdowns Reasons" name="Reasons" id="Reasons">
                                <option value="">Trigger Reason</option>
                                <option value="hard-flag">Hard flag</option>
                                <option value="temp-flag">Temp flag</option>
                                <option value="restricted-unflag">Restricted unflag</option>
                                <option value="unflag">Un flag</option>
                                <option value="reviewed">Reviewed</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select className="form-control dropdowns Risk-levels" name="Risks" id="Risks">
                                <option value="">Risk level</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="tabs-body-table table-responsive">
                
                {/* Completed Table */}
                <table border={1} className="table tab table-rounded">
                    <thead className='table-secondary'>
                        <tr>
                            <th>User</th>
                            <th onClick={() => handleSort('risklevel')} style={{cursor:'pointer'}}>Risk level</th>
                            <th>Action reason</th>
                            <th onClick={() => handleSort('timetoclose')} style={{cursor:'pointer'}}>Time to close</th>
                            <th onClick={() => handleSort('dateaddedon')} style={{cursor:'pointer'}}>Date added on</th>
                            <th>Action taken by</th>
                        </tr>

                    </thead>
                    <tbody style={{ fontWeight: '500' }}>{renderTableRows(getSortedRecords())}</tbody>
                </table>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* popup form */}
      {isPopupVisible && (
       <div className="popup-overlay">
            <div className="popup-form">
                <div className="head-line">
                    <span style={{fontSize:'20px',fontWeight:'500'}}>Close account</span>
                    <span onClick={() => setPopupVisible(!isPopupVisible)} style={{fontSize:'25px'}}>
                        <RxCrossCircled />
                    </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" style={{color:'grey'}}>Email</label>
                        <input type="text" id="email" className="form-control" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <label>Want to file UAR</label>
                        <input type="radio" id="yes" name="uar" />
                        <label htmlFor="yes">Yes</label>
                        <input type="radio" id="no" name="uar" />
                        <label htmlFor="no">No</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reason" style={{color:'grey'}}>Reason</label>
                        <textarea id="reason" className="form-control" placeholder="Reason"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note" style={{color:'grey'}}>Note</label>
                        <textarea id="note" className="form-control" placeholder="Note"></textarea>
                    </div>
                    <div className="form-group">
                        <input type="radio" id="charge" />
                        <label htmlFor="charge" style={{color:'grey'}}>Charge closure fee</label>
                        <input type="button" value="Close Account" className='btn' onClick={() => setPopupVisible(!isPopupVisible)} style={{float:'right',backgroundColor:'#E4E4E4'}}/>
                    </div>
            </div>
        </div>
     
        )}

    </div>
  );
}

export default Dashboard;
