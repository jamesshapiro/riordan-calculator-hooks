import React from 'react';

import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';

import styled from 'styled-components';

import { formatDate } from '../../utils';

const AUTH_ENDPOINT = process.env.REACT_APP_MATRIX_URL_AUTH;

function MatrixHeader() {
  const { matrixCreator, matrixId, title, comment, createdAt, creatorName } =
    React.useContext(DataContext);
  const { user, token } = React.useContext(UserContext);
  const [localTitle, setLocalTitle] = React.useState(title);
  const [titleIsEditable, setTitleIsEditable] = React.useState(false);
  const [localComment, setLocalComment] = React.useState(comment);
  const [commentIsEditable, setCommentIsEditable] = React.useState(false);
  const [editWasRequested, setEditWasRequested] = React.useState(false);
  const [editWasCompleted, setEditWasCompleted] = React.useState(false);

  function handleRequest() {
    setEditWasRequested(true);
    setEditWasCompleted(false);
    setTitleIsEditable(false);
    setCommentIsEditable(false);
  }

  React.useEffect(() => {
    setLocalTitle(title);
  }, [title]);
  React.useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  React.useEffect(() => {
    async function submitMatrixHeaderData(matrixIdentifier) {
      const URL = AUTH_ENDPOINT + `query?id=${matrixIdentifier}`;
      const HEADERS = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
      const payload = {
        title: localTitle,
        comment: localComment,
      };
      const request = new Request(URL, {
        method: 'PUT',
        headers: HEADERS,
        timeout: 100000,
        body: JSON.stringify(payload),
      });
      const response = await fetch(request);
      const json = await response.json();
      return json;
    }
    if (editWasRequested && !editWasCompleted) {
      submitMatrixHeaderData(matrixId);
      setEditWasRequested(false);
      setEditWasCompleted(true);
    }
  }, [editWasRequested, editWasCompleted]);

  if (!matrixId) {
    return <></>;
  }

  const userIsMatrixCreator = user === matrixCreator;
  let titleHeader = <></>;

  const miniEditIcon = (
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.3'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-square-pen'
    >
      <path d='M7.5 1.875H3.125a1.25 1.25 0 0 0-1.25 1.25v8.75a1.25 1.25 0 0 0 1.25 1.25h8.75a1.25 1.25 0 0 0 1.25-1.25v-4.375' />
      <path d='M11.4844 1.64062a1.32812 1.32812 0 1 1 1.875 1.875L7.5 9.375l-2.5 0.625 0.625-2.5Z' />
    </StyledSVG>
  );

  const editIcon = (
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-square-pen'
    >
      <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z' />
    </StyledSVG>
  );
  if (userIsMatrixCreator) {
    titleHeader = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleRequest();
        }}
      >
        <TitleInput
          id='title-field'
          value={localTitle}
          placeholder='Give Your Matrix A Title!'
          onChange={(event) => {
            setLocalTitle(event.target.value);
          }}
          onBlur={(event) => {
            handleRequest();
          }}
        />
      </form>
    );
  }
  if (title !== '' && !titleIsEditable) {
    titleHeader = (
      <TitleBox>
        <StyledH1>
          <span onClick={() => setTitleIsEditable(true)}>
            <TitleSpan>{userIsMatrixCreator ? editIcon : null}</TitleSpan>
            {userIsMatrixCreator ? ' ' : null}
            {localTitle}
          </span>
        </StyledH1>
      </TitleBox>
    );
  }
  let commentHeader = <></>;
  if (userIsMatrixCreator) {
    commentHeader = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleRequest();
        }}
      >
        <CommentInput
          id='comment-field'
          value={localComment}
          placeholder='Add A Comment!'
          onChange={(event) => {
            setLocalComment(event.target.value);
          }}
          onBlur={(event) => {
            handleRequest();
          }}
        />
      </form>
    );
  }
  if (localComment !== '' && !commentIsEditable) {
    commentHeader = (
      <CommentBox>
        <span onClick={() => setCommentIsEditable(true)}>
          {userIsMatrixCreator ? miniEditIcon : null}
          {userIsMatrixCreator ? ' ' : null}
          {localComment}
        </span>
      </CommentBox>
    );
  }

  let attributionBox = <></>;
  if (creatorName && matrixCreator && createdAt) {
    attributionBox = (
      <AttributionBox>
        <AttributionP>{`${creatorName} <${matrixCreator}>`}</AttributionP>
        <AttributionP>{`${formatDate(createdAt)}`}</AttributionP>
      </AttributionBox>
    );
  }
  return (
    <>
      {titleHeader}
      {commentHeader}
      {attributionBox}
    </>
  );
}

export default MatrixHeader;

const TitleSpan = styled.span`
  cursor: pointer;
`;

const StyledSVG = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: translateY(2px);
`;

const TitleInput = styled.input`
  background-color: var(--matrix-header-field);
  padding: 12px;
  border: solid 1px var(--number-box-border-color);
  border-radius: 2px;
  min-width: 500px;
  display: inline;
  margin-bottom: 10px;
  font-size: 2rem;
`;

const TitleBox = styled.div`
  background-color: var(--matrix-header-field);
  padding: 12px;
  border: solid 1px var(--number-box-border-color);
  border-radius: 2px;
  min-width: 500px;
  margin-bottom: 10px;
  display: inline;
`;

const CommentInput = styled.input`
  background-color: var(--matrix-header-field);
  padding: 12px;
  border: solid 1px var(--number-box-border-color);
  border-radius: 2px;
  min-width: 500px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
`;

const CommentBox = styled.div`
  background-color: var(--matrix-header-field);
  padding: 12px;
  border: solid 1px var(--number-box-border-color);
  border-radius: 2px;
  min-width: 500px;
  max-width: 500px;
  margin-bottom: 10px;
`;

const AttributionBox = styled.div`
  text-align: center;
  background-color: white;
  padding: 12px;
  border: solid 1px var(--number-box-border-color);
  border-radius: 10px;
`;

const StyledH1 = styled.h1`
  text-align: left;
`;

const AttributionP = styled.p`
  cursor: default;
`;
