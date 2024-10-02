import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from '@mui/material';
import { ContentCopy, Visibility, Delete } from '@mui/icons-material';
import styled from 'styled-components';
import axios from 'axios';
import { useGlobalInfoStore } from '../../context/globalInfo';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  margin-left: 50px;
`;

const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyName, setApiKeyName] = useState<string>('Maxun API Key');
  const [loading, setLoading] = useState<boolean>(true);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { notify } = useGlobalInfoStore();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/auth/api-key');
        setApiKey(data.api_key);
      } catch (error: any) {
        notify('error', `Failed to fetch API Key - ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const generateApiKey = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:8080/auth/generate-api-key');
      setApiKey(data.api_key);
      notify('success', `Generated API Key successfully`);
    } catch (error: any) {
      notify('error', `Failed to generate API Key - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async () => {
    setLoading(true);
    try {
      await axios.delete('http://localhost:8080/auth/delete-api-key');
      setApiKey(null);
      notify('success', 'API Key deleted successfully');
    } catch (error: any) {
      notify('error', `Failed to delete API Key - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      notify('info', 'Copied to clipboard');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h5">Manage Your API Key</Typography>

      {apiKey ? (
        <TableContainer component={Paper} sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>API Key Name</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{apiKeyName}</TableCell>
                <TableCell>{showKey ? `${apiKey?.substring(0, 10)}...` : '***************'}</TableCell>
                <TableCell>
                  <Tooltip title="Copy API Key">
                    <IconButton onClick={copyToClipboard}>
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={showKey ? 'Hide API Key' : 'Show API Key'}>
                    <IconButton onClick={() => setShowKey(!showKey)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete API Key">
                    <IconButton onClick={deleteApiKey} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Typography>You haven't generated an API key yet.</Typography>
          <Button onClick={generateApiKey} variant="contained" color="primary">
            Generate API Key
          </Button>
        </>
      )}
    </Container>
  );
};

export default ApiKeyManager;