import React from 'react';

import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';

import styles from './MatrixHeader.module.css';

import { formatDate } from '../../utils';

const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH || '';

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
    <svg
      className={`${styles.styledSVG} lucide lucide-square-pen`}
      xmlns='http://www.w3.org/2000/svg'
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.3'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M7.5 1.875H3.125a1.25 1.25 0 0 0-1.25 1.25v8.75a1.25 1.25 0 0 0 1.25 1.25h8.75a1.25 1.25 0 0 0 1.25-1.25v-4.375' />
      <path d='M11.4844 1.64062a1.32812 1.32812 0 1 1 1.875 1.875L7.5 9.375l-2.5 0.625 0.625-2.5Z' />
    </svg>
  );

  const editIcon = (
    <svg
      className={`${styles.styledSVG} lucide lucide-square-pen`}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z' />
    </svg>
  );
  if (userIsMatrixCreator) {
    titleHeader = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleRequest();
        }}
      >
        <input
          className={styles.titleInput}
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
      <div className={styles.titleBox}>
        <h1 className={styles.styledH1}>
          <span onClick={() => setTitleIsEditable(true)}>
            <span className={styles.titleSpan}>{userIsMatrixCreator ? editIcon : null}</span>
            {userIsMatrixCreator ? ' ' : null}
            {localTitle}
          </span>
        </h1>
      </div>
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
        <input
          className={styles.commentInput}
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
      <div className={styles.commentBox}>
        <span onClick={() => setCommentIsEditable(true)}>
          {userIsMatrixCreator ? miniEditIcon : null}
          {userIsMatrixCreator ? ' ' : null}
          {localComment}
        </span>
      </div>
    );
  }

  let attributionBox = <></>;
  if (creatorName && matrixCreator && createdAt) {
    attributionBox = (
      <div className={styles.attributionBox}>
        <p className={styles.attributionP}>{`${creatorName} <${matrixCreator}>`}</p>
        <p className={styles.attributionP}>{`${formatDate(createdAt)}`}</p>
      </div>
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
