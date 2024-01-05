import React, { useState, useEffect } from 'react';
import {FaSearch, FaTrashAlt} from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const SearchForm = styled.form`
  display : flex;
  flex-direction : row;
`;

const SearchIcon = styled(FaSearch)`
  width: 1.3rem;
  height: 1.3rem;
  border : 0.1rem solid black;
  margin-right : -0.1rem;
`

const SearchInput = styled.input`
  width: 100%;
  height: 1.5rem;
  background-color: white;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const DockerRegistryApp = () => {
  const [images, setImages] = useState([]);
  const registryUrl = process.env.REACT_APP_SERVER;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${registryUrl}/v2/_catalog`);
      const imageDetails = await Promise.all(
        response.data.repositories.map(async (image) => {
          const tagsResponse = await axios.get(`${registryUrl}/v2/${image}/tags/list`);
          return {
            name: image,
            tag: tagsResponse.data.tags,
          };
        })
      );
      setImages(imageDetails);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const deleteImage = async (imageName, tag) => {
    if (window.confirm(`정말 ${imageName}:${tag} 이미지를 삭제할까요?`)) {
      try {
        // console.log(`이미지 삭제 중: ${imageName}:${tag}`);
        alert('이미지 삭제 기능은 현재 지원하지 않습니다');
        fetchImages();
      } catch (error) {
        console.error('이미지 삭제 도중 오류가 발생했습니다:', error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>LEESH's <br/>Docker Hub</Title>
        <SearchForm>
          <SearchIcon/>
          <SearchInput placeholder="검색할 이미지명 입력..." type="search" />
        </SearchForm>
      </Header>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>이미지 명</TableHeader>
            <TableHeader>태그 명</TableHeader>
            <TableHeader>삭제</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {images.map(({ name, tag }) => (
            <TableRow key={`${name}:${tag}`}>
              <TableCell>{name}</TableCell>
              <TableCell>{tag}</TableCell>
              <TableCell>
                <Button onClick={() => deleteImage(name, tag)}>
                  <FaTrashAlt />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DockerRegistryApp;
