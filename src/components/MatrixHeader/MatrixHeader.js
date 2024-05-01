import React from 'react';

import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';

import styled from 'styled-components';

import { formatDate } from '../../utils';

function MatrixHeader() {
  const { matrixCreator, title, comment, createdAt, creatorName } =
    React.useContext(DataContext);
  const { user, token } = React.useContext(UserContext);
  const userIsMatrixCreator = user === matrixCreator;
  const titleHeader = userIsMatrixCreator ? (
    title === '' ? (
      <h1>{'Give Your Matrix A Title!'}</h1>
    ) : (
      <h1>{title}</h1>
    )
  ) : (
    <h1>{title}</h1>
  );
  const commentHeader = userIsMatrixCreator ? (
    comment === '' ? (
      <p>{'Add A Comment!'}</p>
    ) : (
      <p>{comment}</p>
    )
  ) : (
    <p>{comment}</p>
  );
  return (
    <>
      <TitleBox>{titleHeader}</TitleBox>
      <CommentBox>{commentHeader}</CommentBox>

      <AttributionBox>
        <AttributionP>{`${creatorName} <${matrixCreator}>`}</AttributionP>
        <AttributionP>{`${formatDate(createdAt)}`}</AttributionP>
      </AttributionBox>
    </>
  );
}

export default MatrixHeader;

const TitleBox = styled.div`
  background-color: yellow;
  padding: 12px;
  border: solid 1px black;
  border-radius: 2px;
  min-width: 500px;
`;

const CommentBox = styled.div`
  background-color: yellow;
  padding: 12px;
  border: solid 1px black;
  border-radius: 2px;
  min-height: 100px;
  min-width: 500px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const AttributionBox = styled.div`
  text-align: center;
  background-color: white;
  padding: 12px;
  border: solid 1px black;
  border-radius: 10px;
`;

const AttributionP = styled.p`
  cursor: default;
`;
