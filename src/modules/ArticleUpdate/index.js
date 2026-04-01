import { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { LoadingElement, PageHead, Link, L } from 'components';
import { useApiGetArticle, useApiListArticles } from 'lib/api/methods/articleApi';
import { usePageManager } from 'lib/hooks';
import { userContext } from 'lib/contexts/UserContext';
import { PageErrors } from './PageErrors';
import { EditArticle } from './EditArticle';


const ThisPageWrapper = styled('div')`
  padding: 2em;
`;


const ArticleUpdate = () => {
  const { userState } = useContext(userContext);
  const [ articleToEdit, setArticleToEdit ] = useState();
  const isPermitted = userState.permissionsCheck.has('article_control');

  const { data: articleList, isLoading: articleListIsLoading, error: articleListError } = useApiListArticles({ type: 'system', showDeleted: true });
  const { data: selectedArticle, isLoading: selectedArticleLoading, error: selectedArticleError } = useApiGetArticle({ slug: articleToEdit });

  const {
    pageStage,
    setPageStage,
    pageError,
    setPageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/article-update',
      handledErrors: [ 'FAILED_TO_FETCH', 'INADEQUATE_PERMISSION', 'INVALID_URL' ],
    },
    defaultRoutingPath: '/article-update',
    defaultPageStage: 'loading',
    apiIsLoading: !isPermitted || articleListIsLoading || selectedArticleLoading,
    apiErrors: articleListError || selectedArticleError,
  });

  // Anytime the user's permission changes
  useEffect(() => {
    if (!isPermitted) { setPageError('INADEQUATE_PERMISSION'); }
  }, [ isPermitted, setPageError ]);


  // When an article is selected
  useEffect(() => {
    if (selectedArticle) {
      setPageStage('edit_article');
    }
  }, [ selectedArticle, setPageStage ]);

  const handleBackToSelection = (overrideStage) => {
    setArticleToEdit(undefined);
    setPageStage(overrideStage || 'main');
  };

  return (
    <ThisPageWrapper>
      <PageHead title="Article Update" />

      <Link href="/">
        <Button
          variant="outlined"
          color="primary"
        >Back to Home</Button>
      </Link>
      <br /><br />

      <L.h1 color="primary">
        Article Update
      </L.h1>
      <br />


      {/* /////////// */}
      {/* Page Errors */}
      {/* /////////// */}
      <PageErrors pageError={ pageError } />


      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      {pageStage === 'loading' && (
        <LoadingElement article />
      )}


      {pageStage === 'success' && (
        <div>
          <h2>Success!</h2>
          <p>The article was saved.</p>

          <Button
            variant="contained"
            color="primary"
            onClick={ () => handleBackToSelection() }
          >Back to Article Selection</Button>
          <br />
        </div>
      )}


      {pageStage === 'main' && (
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="article_to_edit">Article to Edit</InputLabel>
            <Select
              native
              name="Article to Edit"
              label="Article to Edit"
              id="article_to_edit"
              style={{ width: '14em' }}
              value={ articleToEdit }
              onChange={ event => setArticleToEdit(event.target.value) }
            >
              <option value="" />
              {articleList.map(article => (
                <option key={ article.slug } value={ article.slug }>{article.title}</option>
              ))}
            </Select>
          </FormControl>
        </div>
      )}


      {pageStage === 'edit_article' && (
        <EditArticle 
          handleBackToSelection={ handleBackToSelection }
          articleDetails={ selectedArticle }
          setPageError={ setPageError }
          handleApiError={ handleApiError }
        />
      )}

    </ThisPageWrapper>
  );
};


export default ArticleUpdate;
