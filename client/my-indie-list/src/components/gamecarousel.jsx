import React, { useMemo } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import MyCard from './card';
import '../style/gamecarousel.css'

function MyGameCarousel({ games, userFavorites, handleAddToFavorites, handleRemoveFromFavorites, selectedGame, setSelectedGame }) {
  const sortedCards = useMemo(() => {
    if (games) {
      return [...games].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return [];
    }
  }, [games]);

  // Dividi l'array di giochi in sotto-array di 4 elementi ciascuno
  const chunkSize = 3;
  const chunks = [];
  for (let i = 0; i < sortedCards.length; i += chunkSize) {
    chunks.push(sortedCards.slice(i, i + chunkSize));
  }

  return (
    <Carousel >
      {chunks.map((chunk, index) => (
        <Carousel.Item key={index}>
          <Row>
            {chunk.map((game) => (
              <Col key={game._id}>
                <MyCard
                  game={game}
                  userFavorites={userFavorites}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  selectedGame={selectedGame}
                  setSelectedGame={setSelectedGame}
                />
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MyGameCarousel;