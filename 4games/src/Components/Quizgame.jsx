import React, { useState, useEffect, useCallback } from 'react';
import './QuizGame.css';
import { useNavigate } from 'react-router-dom';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};



const multipleChoiceQuestions = {
  anatomy: [
    { question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Lungs"], answer: "Skin" },
    { question: "How many bones are in the adult human body?", options: ["206", "201", "210", "196"], answer: "206" },
    { question: "What part of the brain controls balance?", options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"], answer: "Cerebellum" },
    { question: "Which blood type is known as the universal donor?", options: ["A", "B", "AB", "O-"], answer: "O-" },
    { question: "What is the main function of red blood cells?", options: ["Fight infections", "Carry oxygen", "Clot blood", "Produce hormones"], answer: "Carry oxygen" },
    { question: "Which organ is responsible for filtering blood?", options: ["Liver", "Kidneys", "Spleen", "Pancreas"], answer: "Kidneys" },
    { question: "What muscle is the strongest in the human body?", options: ["Biceps", "Quadriceps", "Masseter", "Gluteus Maximus"], answer: "Masseter" },
    { question: "How many chambers does the human heart have?", options: ["2", "3", "4", "5"], answer: "4" },
    { question: "What type of joint is the shoulder?", options: ["Hinge", "Ball and socket", "Pivot", "Saddle"], answer: "Ball and socket" },
    { question: "Which system in the body is responsible for hormone production?", options: ["Nervous system", "Endocrine system", "Digestive system", "Respiratory system"], answer: "Endocrine system" },
    { question: "What is the smallest bone in the human body?", options: ["Stapes", "Incus", "Malleus", "Coccyx"], answer: "Stapes" },
    { question: "Which organ produces insulin?", options: ["Liver", "Pancreas", "Kidneys", "Spleen"], answer: "Pancreas" },
    { question: "What is the primary function of the large intestine?", options: ["Absorb nutrients", "Absorb water", "Digest proteins", "Filter toxins"], answer: "Absorb water" },
    { question: "Which part of the eye controls the amount of light that enters?", options: ["Cornea", "Iris", "Pupil", "Retina"], answer: "Iris" },
    { question: "What type of blood vessel carries blood away from the heart?", options: ["Veins", "Arteries", "Capillaries", "Venules"], answer: "Arteries" },
    { question: "Which organ is part of both the digestive and respiratory systems?", options: ["Esophagus", "Trachea", "Pharynx", "Larynx"], answer: "Pharynx" },
    { question: "What is the name of the bone that protects the brain?", options: ["Femur", "Skull", "Clavicle", "Scapula"], answer: "Skull" },
    { question: "Which muscle is responsible for breathing?", options: ["Diaphragm", "Intercostals", "Abdominals", "Pectorals"], answer: "Diaphragm" },
    { question: "What is the main function of white blood cells?", options: ["Carry oxygen", "Fight infections", "Clot blood", "Transport nutrients"], answer: "Fight infections" },
    { question: "Which part of the brain is responsible for memory?", options: ["Cerebrum", "Hippocampus", "Amygdala", "Thalamus"], answer: "Hippocampus" },
    { question: "What type of tissue connects muscles to bones?", options: ["Ligaments", "Tendons", "Cartilage", "Fascia"], answer: "Tendons" },
    { question: "Which organ is primarily responsible for detoxifying chemicals?", options: ["Kidneys", "Liver", "Lungs", "Spleen"], answer: "Liver" },
    { question: "What is the name of the pigment that gives skin its color?", options: ["Melanin", "Keratin", "Collagen", "Elastin"], answer: "Melanin" },
    { question: "Which part of the ear is responsible for balance?", options: ["Cochlea", "Eardrum", "Semicircular canals", "Auditory nerve"], answer: "Semicircular canals" },
    { question: "What is the primary function of platelets?", options: ["Carry oxygen", "Fight infections", "Clot blood", "Transport nutrients"], answer: "Clot blood" },
    { question: "Which gland is known as the 'master gland' of the endocrine system?", options: ["Thyroid", "Pituitary", "Adrenal", "Pineal"], answer: "Pituitary" },
    { question: "What is the name of the longest bone in the human body?", options: ["Femur", "Tibia", "Humerus", "Fibula"], answer: "Femur" },
    { question: "Which organ stores bile produced by the liver?", options: ["Pancreas", "Gallbladder", "Stomach", "Small intestine"], answer: "Gallbladder" },
    { question: "What type of muscle is the heart made of?", options: ["Skeletal muscle", "Smooth muscle", "Cardiac muscle", "Voluntary muscle"], answer: "Cardiac muscle" },
    
  ],
  general: [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
    { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], answer: "Blue Whale" },
    { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Gd", "Go"], answer: "Au" },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
    { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: "Diamond" },
    { question: "Which element has the atomic number 1?", options: ["Oxygen", "Hydrogen", "Helium", "Carbon"], answer: "Hydrogen" },
    { question: "What is the largest continent on Earth?", options: ["Africa", "Asia", "Europe", "Antarctica"], answer: "Asia" },
    { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: "Leonardo da Vinci" },
    { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2" },
    { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
    { question: "What is the main ingredient in traditional Japanese miso soup?", options: ["Rice", "Soybeans", "Seaweed", "Fish"], answer: "Soybeans" },
    { question: "Who is known as the 'Father of Modern Physics'?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], answer: "Albert Einstein" },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
    { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "South Korea"], answer: "Japan" },
    { question: "What is the process by which plants make their food?", options: ["Respiration", "Photosynthesis", "Transpiration", "Germination"], answer: "Photosynthesis" },
    { question: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Gregor Mendel"], answer: "Alexander Fleming" },
    { question: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Yen"], answer: "Pound Sterling" },
    { question: "Which planet has the most moons?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Saturn" },
    { question: "What is the boiling point of water at sea level?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" },
    { question: "Who wrote the novel '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Jules Verne"], answer: "George Orwell" },
    { question: "What is the main language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: "Portuguese" },
    { question: "Which organ in the human body is responsible for filtering waste from the blood?", options: ["Liver", "Kidneys", "Lungs", "Heart"], answer: "Kidneys" },
    { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Antarctic Desert"], answer: "Antarctic Desert" },
    { question: "Who is the author of the Harry Potter series?", options: ["J.R.R. Tolkien", "J.K. Rowling", "C.S. Lewis", "George R.R. Martin"], answer: "J.K. Rowling" },
    { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Pepper"], answer: "Avocado" },
    { question: "Which planet is closest to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: "Mercury" },
    { question: "What is the largest organ inside the human body?", options: ["Liver", "Heart", "Lungs", "Kidneys"], answer: "Liver" },
    { question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], answer: "Alexander Graham Bell" },
    { question: "What is the main gas found in the Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Nitrogen" },
    { question: "Which country hosted the 2016 Summer Olympics?", options: ["China", "Brazil", "UK", "Russia"], answer: "Brazil" },

  ],
  history: [
    { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: "George Washington" },
    { question: "In which year did World War II end?", options: ["1940", "1945", "1950", "1939"], answer: "1945" },
    { question: "What ancient civilization built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians" },
    { question: "Who was known as the Maid of Orléans?", options: ["Marie Antoinette", "Joan of Arc", "Catherine the Great", "Elizabeth I"], answer: "Joan of Arc" },
    { question: "Which empire was ruled by Genghis Khan?", options: ["Roman Empire", "Mongol Empire", "Ottoman Empire", "Persian Empire"], answer: "Mongol Empire" },
    { question: "What year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], answer: "1989" },
    { question: "Who was the British Prime Minister during most of World War II?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Margaret Thatcher"], answer: "Winston Churchill" },
    { question: "What was the name of the ship that brought the Pilgrims to America in 1620?", options: ["Santa Maria", "Mayflower", "Beagle", "Endeavour"], answer: "Mayflower" },
    { question: "Who was the first man to step on the moon?", options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], answer: "Neil Armstrong" },
    { question: "Which war was fought between the North and South regions in the United States?", options: ["World War I", "Civil War", "Revolutionary War", "Vietnam War"], answer: "Civil War" },
    { question: "Who was the leader of the Soviet Union during World War II?", options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Leon Trotsky"], answer: "Joseph Stalin" },
    { question: "What year did the French Revolution begin?", options: ["1787", "1789", "1791", "1793"], answer: "1789" },
    { question: "Who was the first  female Prime Minister of the United Kingdom?", options: ["Theresa May", "Margaret Thatcher", "Angela Merkel", "Indira Gandhi"], answer: "Margaret Thatcher" },
    { question: "What was the name of the first permanent English settlement in America?", options: ["Plymouth", "Roanoke", "Jamestown", "Salem"], answer: "Jamestown" },
    { question: "Who was the Egyptian queen famous for her beauty and political acumen?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"], answer: "Cleopatra" },
    { question: "In which year did India gain independence from British rule?", options: ["1945", "1947", "1950", "1952"], answer: "1947" },
    { question: "Who was the first emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Caligula"], answer: "Augustus" },
    { question: "What was the name of the ship on which Charles Darwin made his famous voyage?", options: ["HMS Beagle", "HMS Endeavour", "HMS Victory", "HMS Bounty"], answer: "HMS Beagle" },
    { question: "Who was the leader of the  Civil Rights Movement in the United States during the 1960s?", options: ["Malcolm X", "Martin Luther King Jr.", "Rosa Parks", "Frederick Douglass"], answer: "Martin Luther King Jr." },
    { question: "What year did the American Civil War begin?", options: ["1859", "1861", "1863", "1865"], answer: "1861" },
    { question: "Who was the first woman to fly solo across the Atlantic Ocean?", options: ["Amelia Earhart", "Sally Ride", "Harriet Quimby", "Bessie Coleman"], answer: "Amelia Earhart" },
    { question: "What was the name of the treaty that ended World War I?", options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Ghent", "Treaty of Tordesillas"], answer: "Treaty of Versailles" },
    { question: "Who was the last emperor of China?", options: ["Kangxi", "Qianlong", "Puyi", "Yongle"], answer: "Puyi" },
    { question: "In which year did the Russian Revolution take place?", options: ["1915", "1917", "1919", "1921"], answer: "1917" },
    { question: "Who was the leader of the  Mongol Empire?", options: ["Kublai Khan", "Genghis Khan", "Tamerlane", "Ogedei Khan"], answer: "Genghis Khan" },
    { question: "What was the name of the first artificial satellite launched into space?", options: ["Explorer 1", "Sputnik 1", "Vostok 1", "Apollo 11"], answer: "Sputnik 1" },
    { question: "Who was the first Chancellor of Germany?", options: ["Otto von Bismarck", "Adolf Hitler", "Konrad Adenauer", "Helmut Kohl"], answer: "Otto von Bismarck" },
    { question: "What year did the Great Depression begin?", options: ["1927", "1929", "1931", "1933"], answer: "1929" },


  ],
};


const booleanQuestions = {
  anatomy: [
    { question: "The human heart has five chambers.", answer: false },
    { question: "Skin is the largest organ in the human body.", answer: true },
    { question: "The femur is the longest bone in the human body.", answer: true },
    { question: "The liver is responsible for producing insulin.", answer: false },
    { question: "The human body has four lungs.", answer: false },
    { question: "The cerebellum is responsible for balance and coordination.", answer: true },
    { question: "Red blood cells carry oxygen throughout the body.", answer: true },
    { question: "The small intestine is longer than the large intestine.", answer: true },
    { question: "The human body has 206 bones.", answer: true },
    { question: "The pancreas produces bile to aid in digestion.", answer: false },
    { question: "The diaphragm is a muscle that helps with breathing.", answer: true },
    { question: "White blood cells help fight infections.", answer: true },
    { question: "The human brain is divided into three main parts.", answer: true },
    { question: "Tendons connect bones to other bones.", answer: false },
    { question: "The kidneys filter waste from the blood.", answer: true },
    { question: "Melanin is responsible for hair color.", answer: true },
    { question: "The semicircular canals in the ear help with hearing.", answer: false },
    { question: "Platelets are involved in blood clotting.", answer: true },
    { question: "The pituitary gland is known as the 'master gland' of the endocrine system.", answer: true },
    { question: "The stapes is the smallest bone in the human body.", answer: true },
    { question: "The gallbladder stores bile produced by the liver.", answer: true },
    { question: "Cardiac muscle is found in the walls of the heart.", answer: true },
    { question: "The human body has three types of muscle tissue: skeletal, smooth, and cardiac.", answer: true },
    { question: "The esophagus is part of both the digestive and respiratory systems.", answer: false },
    { question: "The cornea is the transparent front part of the eye.", answer: true },
    { question: "Arteries carry blood toward the heart.", answer: false },
    { question: "The brainstem controls basic life functions like breathing and heartbeat.", answer: true },
    { question: "The largest organ inside the human body is the liver.", answer: true },
    { question: "The human body has more than 600 muscles.", answer: true },
    { question: "The adrenal glands are located above the kidneys.", answer: true },
    { question: "The trachea is also known as the windpipe.", answer: true },

  ],
  general: [
    { question: "Mount Everest is the tallest mountain in the world.", answer: true },
    { question: "The capital of Australia is Sydney.", answer: false },
    { question: "A byte consists of 8 bits.", answer: true },
    { question: "The chemical symbol for silver is Ag.", answer: true },
    { question: "Shakespeare wrote 'The Odyssey'.", answer: false },
    { question: "The Great Wall of China is visible from space.", answer: false },
    { question: "The human body has four lungs.", answer: false },
    { question: "The Pacific Ocean is the largest ocean on Earth.", answer: true },
    { question: "Venus is the closest planet to the Sun.", answer: false },
    { question: "The Mona Lisa was painted by Leonardo da Vinci.", answer: true },
    { question: "The smallest prime number is 1.", answer: false },
    { question: "Plants absorb carbon dioxide during photosynthesis.", answer: true },
    { question: "Penicillin was discovered by Alexander Fleming.", answer: true },
    { question: "The currency of Japan is the Yen.", answer: true },
    { question: "Saturn has more moons than any other planet in the solar system.", answer: true },
    { question: "Water boils at 90 degrees Celsius at sea level.", answer: false },
    { question: "George Orwell wrote the novel '1984'.", answer: true },
    { question: "The main language spoken in Brazil is Spanish.", answer: false },
    { question: "The largest desert in the world is the Sahara.", answer: false },
    { question: "The capital of Canada is Toronto.", answer: false },
    { question: "The human body has four blood types: A, B, AB, and O.", answer: true },
    { question: "The largest organ in the human body is the skin.", answer: true },
    { question: "The inventor of the telephone was Thomas Edison.", answer: false },
    { question: "The main gas in the Earth's atmosphere is nitrogen.", answer: true },
    { question: "The 2016 Summer Olympics were held in Rio de Janeiro, Brazil.", answer: true },
    { question: "The largest ocean on Earth is the Atlantic Ocean.", answer: false },
    { question: "The process by which plants release water vapor is called transpiration.", answer: true },
    { question: "Albert Einstein is known as the 'Father of Modern Physics'.", answer: true },
    

  ],
  history: [
    { question: "The Titanic sank in the year 1912.", answer: true },
    { question: "Cleopatra was of Greek descent.", answer: true },
    { question: "The Berlin Wall fell in 1989.", answer: true },
    { question: "Winston Churchill was the Prime Minister of the UK during World War I.", answer: false },
    { question: "The Mayflower brought the Pilgrims to America in 1620.", answer: true },
    { question: "Neil Armstrong was the first man to step on the moon.", answer: true },
    { question: "The American Civil War began in 1865.", answer: false },
    { question: "Joseph Stalin was the leader of the Soviet Union during World War II.", answer: true },
    { question: "The French Revolution began in 1789.", answer: true },
    { question: "Margaret Thatcher was the first female Prime Minister of the UK.", answer: true },
    { question: "Jamestown was the first permanent English settlement in America.", answer: true },
    { question: "The Egyptian queen Nefertiti was famous for her beauty.", answer: true },
    { question: "India gained independence from British rule in 1947.", answer: true },
    { question: "Julius Caesar was the first emperor of Rome.", answer: false },
    { question: "Charles Darwin made his famous voyage on the HMS Beagle.", answer: true },
    { question: "Martin Luther King Jr. was a leader in the Civil Rights Movement during the 1960s.", answer: true },
    { question: "The Great Depression began in 1930.", answer: false },
    { question: "The Treaty of Versailles ended World War I.", answer: true },
    { question: "Puyi was the last emperor of China.", answer: true },
    { question: "The Russian Revolution took place in 1917.", answer: true },
    { question: "Genghis Khan was the leader of the Mongol Empire.", answer: true },
    { question: "Sputnik 1 was the first artificial satellite launched into space.", answer: true },
    { question: "Otto von Bismarck was the first Chancellor of Germany.", answer: true },
    { question: "The Great Depression began in 1929.", answer: true },
    { question: "The Renaissance began in the 14th century.", answer: true },
    { question: "The Wright brothers made the first powered flight in 1903.", answer: true },
    { question: "The Cold War was primarily between the USA and China.", answer: false },
    { question: "The Magna Carta was signed in 1215.", answer: true },
    { question: "The Ottoman Empire was dissolved after World War I.", answer: true },
    { question: "The first successful vaccine was developed by Louis Pasteur.", answer: true },
    { question: "The Battle of Hastings took place in 1066.", answer: true },
  ],
};

const identificationQuestions = {
  anatomy: [
    { question: "I am the largest organ in your body, protecting you from the outside world. What am I?", answer: "Skin", hint: "I also help regulate body temperature." },
    { question: "I am a muscle that never stops pumping blood throughout your life. What am I?", answer: "Heart", hint: "I have four chambers." },
    { question: "I am the part of your brain that helps you maintain balance and coordination. What am I?", answer: "Cerebellum", hint: "My name means 'little brain' in Latin." },
    { question: "I am the longest bone in your body, located in your thigh. What am I?", answer: "Femur", hint: "I connect the hip to the knee." },
    { question: "I am the organ that filters waste from your blood and produces urine. What am I?", answer: "Kidneys", hint: "You have two of me." },
    { question: "I am the smallest bone in your body, located in your ear. What am I?", answer: "Stapes", hint: "I am also known as the stirrup bone." },
    { question: "I am the pigment that gives your skin its color. What am I?", answer: "Melanin", hint: "I protect your skin from UV radiation." },
    { question: "I am the muscle that helps you breathe by contracting and relaxing. What am I?", answer: "Diaphragm", hint: "I separate the chest cavity from the abdominal cavity." },
    { question: "I am the gland known as the 'master gland' of the endocrine system. What am I?", answer: "Pituitary gland", hint: "I control other glands in your body." },
    { question: "I am the organ that produces bile to help digest fats. What am I?", answer: "Liver", hint: "I am the largest internal organ." },
    { question: "I am the part of your eye that controls the amount of light entering. What am I?", answer: "Iris", hint: "I am the colored part of your eye." },
    { question: "I am the type of blood vessel that carries blood away from the heart. What am I?", answer: "Arteries", hint: "I have thick, muscular walls." },
    { question: "I am the part of your brain responsible for memory formation. What am I?", answer: "Hippocampus", hint: "I am named after a sea horse." },
    { question: "I am the tissue that connects muscles to bones. What am I?", answer: "Tendons", hint: "I am strong and flexible." },
    { question: "I am the organ that stores bile produced by the liver. What am I?", answer: "Gallbladder", hint: "I am a small, pear-shaped organ." },
    { question: "I am the type of muscle found only in the heart. What am I?", answer: "Cardiac muscle", hint: "I contract involuntarily." },
    { question: "I am the bone that protects your brain. What am I?", answer: "Skull", hint: "I am made up of several fused bones." },
    { question: "I am the part of your ear that helps with balance. What am I?", answer: "Semicircular canals", hint: "I am filled with fluid and tiny hairs." },

  ],
  general: [
    { question: "I am the capital city of France, known for the Eiffel Tower. What am I?", answer: "Paris", hint: "I am also known as the 'City of Light'." },
    { question: "I am the fourth planet from the Sun, known as the Red Planet. What am I?", answer: "Mars", hint: "I am named after the Roman god of war." },
    { question: "I am the largest mammal on Earth, living in the ocean. What am I?", answer: "Blue Whale", hint: "I am the largest animal ever known to have lived on Earth." },
    { question: "I am the chemical element with the symbol 'Au'. What am I?", answer: "Gold", hint: "I am a precious metal often used in jewelry." },
    { question: "I am the playwright who wrote 'Romeo and Juliet'. Who am I?", answer: "William Shakespeare", hint: "I am often called England's national poet." },
    { question: "I am the hardest natural substance on Earth. What am I?", answer: "Diamond", hint: "I am often used in cutting tools and jewelry." },
    { question: "I am the element with atomic number 1. What am I?", answer: "Hydrogen", hint: "I am the most abundant element in the universe." },
    { question: "I am the largest continent on Earth. What am I?", answer: "Asia", hint: "I am home to the highest mountain, Mount Everest." },
    { question: "I am the artist who painted the Mona Lisa. Who am I?", answer: "Leonardo da Vinci", hint: "I was also an inventor and scientist." },
    { question: "I am the smallest prime number. What am I?", answer: "2", hint: "I am the only even prime number." },
    { question: "I am the process by which plants make their food using sunlight. What am I?", answer: "Photosynthesis", hint: "I convert light energy into chemical energy." },
    { question: "I am the scientist who discovered penicillin. Who am I?", answer: "Alexander Fleming", hint: "I was a Scottish bacteriologist." },
    { question: "I am the currency used in the United Kingdom. What am I?", answer: "Pound Sterling", hint: "My symbol is £." },
    { question: "I am the planet with the most moons in our solar system. What am I?", answer: "Saturn", hint: "I am known for my prominent ring system." },
    { question: "I am the boiling point of water at sea level in degrees Celsius. What am I?", answer: "100", hint: "I am a three-digit number." },
    { question: "I am the author of the novel '1984'. Who am I?", answer: "George Orwell", hint: "I also wrote 'Animal Farm'." },
    { question: "I am the main language spoken in Brazil. What am I?", answer: "Portuguese", hint: "I am not Spanish." },
    { question: "I am the largest desert in the world. What am I?", answer: "Antarctic Desert", hint: "I am located at the South Pole." },
    { question: "I am the author of the Harry Potter series. Who am I?", answer: "J.K. Rowling", hint: "I am a British writer." },
    { question: "I am the main ingredient in guacamole. What am I?", answer: "Avocado", hint: "I am a green fruit with a large seed." },
    { question: "I am the closest planet to the Sun. What am I?", answer: "Mercury", hint: "I am named after the Roman messenger god." },
    { question: "I am the largest organ inside the human body. What am I?", answer: "Liver", hint: "I help detoxify chemicals and metabolize drugs." },
    { question: "I am the inventor of the telephone. Who am I?", answer: "Alexander Graham Bell", hint: "I was a Scottish-born inventor." },
    { question: "I am the main gas found in the Earth's atmosphere. What am I?", answer: "Nitrogen", hint: "I make up about 78% of the atmosphere." },
    { question: "I am the country that hosted the 2016 Summer Olympics. What am I?", answer: "Brazil", hint: "My famous city is Rio de Janeiro." },
    { question: "I am the largest ocean on Earth. What am I?", answer: "Pacific Ocean", hint: "I am located between Asia and the Americas." },
    { question: "I am the process by which plants absorb water through their roots and release it as vapor. What am I?", answer: "Transpiration", hint: "I am part of the water cycle." },    
    { question: "I am the scientist known as the 'Father of Modern Physics'. Who am I?", answer: "Albert Einstein", hint: "I developed the theory of relativity." }
  
  ],
  history: [
    { question: "I was the first President of the United States, leading from 1789 to 1797. Who am I?", answer: "George Washington", hint: "I am also known as the 'Father of My Country'." },
    { question: "I was an ancient civilization that built the pyramids in Giza. What am I?", answer: "Egyptians", hint: "I developed along the Nile River." },
    { question: "I was the French heroine known as the Maid of Orléans during the Hundred Years' War. Who am I?", answer: "Joan of Arc", hint: "I was canonized as a saint." },
    { question: "I was the empire ruled by Genghis Khan in the 13th century. What am I?", answer: "Mongol Empire", hint: "I was the largest contiguous land empire in history." },
    { question: "I was the British Prime Minister during most of World War II. Who am I?", answer: "Winston Churchill", hint: "I am known for my speeches and leadership." },
    { question: "I was the ship that brought the Pilgrims to America in 1620. What am I?", answer: "Mayflower", hint: "I landed at Plymouth Rock." },
    { question: "I was the first man to step on the moon in 1969. Who am I?", answer: "Neil Armstrong", hint: "My famous words were 'That's one small step for man, one giant leap for mankind.'"},
    { question: "I was the war fought between the North and South regions in the United States from 1861 to 1865. What am I?", answer: "Civil War", hint: "I am also known as the War Between the States." },
    { question: "I was the leader of the Soviet Union during World War II. Who am I?", answer: "Joseph Stalin", hint: "I succeeded Vladimir Lenin." },
    { question: "I was the revolution that began in France in 1789. What am I?", answer: "French Revolution", hint: "I led to the rise of Napoleon Bonaparte." },
    { question: "I was the first female Prime Minister of the United Kingdom. Who am I?", answer: "Margaret Thatcher", hint: "I was known as the 'Iron Lady'." },
    { question: "I was the first permanent English settlement in America, established in 1607. What am I?", answer: "Jamestown", hint: "I am located in Virginia." },   
    { question: "I was the Egyptian queen famous for my beauty and political acumen. Who am I?", answer: "Cleopatra", hint: "I was the last active ruler of the Ptolemaic Kingdom of Egypt." },
    { question: "I was the year India gained independence from British rule. What year am I?", answer: "1947", hint: "I am two years after the end of World War II." },
    { question: "I was the first emperor of Rome, ruling from 27 BC to AD 14. Who am I?", answer: "Augustus", hint: "I was born Gaius Octavius." },
    { question: "I was the ship on which Charles Darwin made his famous voyage in the 1830s. What am I?", answer: "HMS Beagle", hint: "I was a Royal Navy ship." },
    { question: "I was a leader of the Civil Rights Movement in the United States during the 1960s. Who am I?", answer: "Martin Luther King Jr.", hint: "I delivered the 'I Have a Dream' speech." },
    { question: "I was the treaty that ended World War I in 1919. What am I?", answer: "Treaty of Versailles", hint: "I imposed heavy reparations on Germany." },
    { question: "I was the last emperor of China, abdicating in 1912. Who am I?", answer: "Puyi", hint: "I was also known as the Xuantong Emperor." },
    { question: "I was the year the Russian Revolution took place. What year am I?", answer: "1917", hint: "I led to the rise of the Soviet Union." },
    { question: "I was the leader of the Mongol Empire who founded it in 1206. Who am I?", answer: "Genghis Khan", hint: "My birth name was Temujin." },
    { question: "I was the first artificial satellite launched into space in 1957. What am I?", answer: "Sputnik 1", hint: "I was launched by the Soviet Union." },
    { question: "I was the first Chancellor of Germany, serving from 1871 to 1890. Who am I?", answer: "Otto von Bismarck", hint: "I was known as the 'Iron Chancellor'." },
    { question: "I was the year the Great Depression began with the stock market crash. What year am I?", answer: "1929", hint: "I am the year of Black Tuesday."},
    { question: "I was the leader of the Civil Rights Movement in the United States during the 1960s. Who am I?", answer: "Martin Luther King Jr.", hint: "I delivered the 'I Have a Dream' speech." },
  ],
};


const QuizGame = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("front");
  const [gameMode, setGameMode] = useState(null); 
  const [category, setCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [identificationAnswer, setIdentificationAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const [leaderboards, setLeaderboards] = useState(() => {
    const saved = localStorage.getItem("quizLeaderboards");
    const defaultLeaderboards = { multiple: [], boolean: [], identification: [] };
    return saved ? JSON.parse(saved) : defaultLeaderboards;
  });

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  
  const getTimerDuration = useCallback(() => {
    if (gameMode === "identification") return 30;
    return 10; 
  }, [gameMode]);

  const getQuestionLimit = useCallback(() => {
    if (gameMode === "multiple") return 15;
    if (gameMode === "boolean") return 10;
    if (gameMode === "identification") return 5;
    return 5; 
  }, [gameMode]);

  const shuffleQuestions = useCallback((category, gameMode) => {
    let allQuestions = [];
    const questionLimit = getQuestionLimit();
    
    
    let questionSource;
    if (gameMode === "multiple") questionSource = multipleChoiceQuestions;
    else if (gameMode === "boolean") questionSource = booleanQuestions;
    else if (gameMode === "identification") questionSource = identificationQuestions;
    else return [];

    
    if (category && category !== "all") {
      allQuestions = questionSource[category] || [];
    } else {
      
      Object.keys(questionSource).forEach(cat => {
        allQuestions = [...allQuestions, ...questionSource[cat]];
      });
    }
    
    const shuffled = shuffleArray(allQuestions);
    let selectedQuestions = shuffled.slice(0, Math.min(questionLimit, shuffled.length));

   

    return shuffleArray(selectedQuestions); 
  }, [getQuestionLimit]);

  useEffect(() => {
    if (stage === "quiz") {
      const duration = getTimerDuration();
      setTimeLeft(duration);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleNext();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, currentQuestion, getTimerDuration]);

  useEffect(() => {
    if (category && gameMode) {
      setIsLoading(true);
      const finalQuestions = shuffleQuestions(category, gameMode);
      setQuestions(finalQuestions);
      setCurrentQuestion(0);
      setIsLoading(false);
    }
  }, [category, gameMode, shuffleQuestions]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const currentQ = questions[currentQuestion];
    if (currentQ && currentQ.options[index] === currentQ.answer) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => handleNext(), 1000);
  };

  
  const handleBooleanClick = (answer) => {
    setSelectedOption(answer);
    const currentQ = questions[currentQuestion];
    if (currentQ && currentQ.answer === answer) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => handleNext(), 1000);
  };

  const handleIdentificationSubmit = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;
    const correctAnswer = currentQ.answer.toLowerCase();
    const userAnswer = identificationAnswer.toLowerCase().trim();
    if (userAnswer === correctAnswer) {
      setScore(prev => prev + 1);
    }
    setSelectedOption(true); 
    setTimeout(() => handleNext(), 1500);
  };

  const handleHintClick = () => {
    if (hintsRemaining > 0) {
      setHintsRemaining(prev => prev - 1);
      setShowHint(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIdentificationAnswer("");
    setShowHint(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
     
      const newEntry = { category, gameMode, score, date: new Date().toLocaleString() };
      const currentLeaderboard = leaderboards[gameMode] || [];
      const updatedLeaderboard = [...currentLeaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      const newLeaderboards = { ...leaderboards, [gameMode]: updatedLeaderboard };
      setLeaderboards(newLeaderboards);
      localStorage.setItem("quizLeaderboards", JSON.stringify(newLeaderboards));
      
      setStage("results");
    }
  };

  const resetGame = () => {
    setStage("front");
    setGameMode(null);
    setCategory(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIdentificationAnswer("");
    setQuestions([]);
    setShowHint(false);
    setHintsRemaining(3);
  };

  if (isLoading) {
    return (<div className="container"><div className="header"><h1 className="title">LOADING...</h1></div><div className="main-content"><div className="center-content"><div className="centered-flex-column"><div className="loading-text">Loading questions...</div></div></div></div></div>);
  }

  if (stage === "front") {
    return (
      <div className="container">
        <div className="header"><h1 className="title">QUIZ ARCADE</h1><div className="timer"><span>⏱️</span><span>00:00</span></div></div>
        <div className="main-content">
          <div className="side-panel"><h3 className="game-info">GAME INFO</h3><div className="info-content"><p>Test your knowledge in various categories!</p><p>🏆 High scores are saved locally</p><p>❓ Multiple Choice: 15 questions, 10s each</p><p>✅ True or False: 10 questions, 10s each</p><p>🔍 Identification: 5 questions, 30s each</p></div></div>
          <div className="center-content">
            <div className="decorative-element decorative-element-1"></div>
            <div className="decorative-element decorative-element-2"></div>
            <h2 className="section-title">SELECT GAME MODE</h2>
            <div className="category-selection-container">
              <div className="game-mode-card" onClick={() => { setGameMode("multiple"); setStage("category"); }}><div className="category-icon">❓</div><div className="category-info"><div className="category-title">MULTIPLE CHOICE</div><div className="category-desc">Answer questions by selecting the correct option (15 questions)</div></div></div>
             
              <div className="game-mode-card" onClick={() => { setGameMode("boolean"); setStage("category"); }}><div className="category-icon">✅</div><div className="category-info"><div className="category-title">TRUE OR FALSE</div><div className="category-desc">Decide if the statement is true or false (10 questions)</div></div></div>
              <div className="game-mode-card" onClick={() => { setGameMode("identification"); setStage("category"); }}><div className="category-icon">🔍</div><div className="category-info"><div className="category-title">IDENTIFICATION</div><div className="category-desc">Identify concepts based on descriptive clues (5 questions)</div></div></div>
            </div>
          </div>

          <div className="right-panel"><div className="leaderboard"><h3 className="leaderboard-title">🏆 MULTIPLE CHOICE LEADERBOARD</h3>{(leaderboards.multiple || []).length === 0 ? <p className="empty-leaderboard-text">No scores yet. Be the first!</p> : leaderboards.multiple.map((entry, i) => (<div key={i} className="leaderboard-item"><span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'}</span><span>{entry.score} pts</span></div>))}</div></div>
        </div>
        <div className="footer"><button className="button button-home" onClick={() => navigate('/home')}>🏠 HOME</button><div className="version">QUIZ ARCADE v2.chate</div></div>
      </div>
    );
  }

  if (stage === "category") {
    const modeTitle = gameMode === "multiple" ? "MULTIPLE CHOICE" : gameMode === "boolean" ? "TRUE OR FALSE" : "IDENTIFICATION";
    const modeInfo = gameMode === "multiple" ? "Multiple Choice (15 Qs)" : gameMode === "boolean" ? "True or False (10 Qs)" : "Identification (5 Qs)";
    const timerInfo = gameMode === "identification" ? "30s" : "10s";
    return (
      <div className="container">
        <div className="header"><h1 className="title">{modeTitle}</h1><div className="timer"><span>⏱️</span><span>00:00</span></div></div>
        <div className="main-content">
          <div className="side-panel"><h3 className="game-info">GAME INFO</h3><div className="info-content"><p>Mode: {modeInfo}</p><p>🏆 High scores are saved locally</p><p>⏱️ Time limit: {timerInfo} per question</p></div></div>
          <div className="center-content">
            <div className="decorative-element decorative-element-1"></div>
            <div className="decorative-element decorative-element-2"></div>
            <h2 className="section-title">SELECT CATEGORY</h2>
            <div className="category-selection-container">
              <div className="category-card" onClick={() => { setCategory("anatomy"); setStage("quiz"); }}><div className="category-icon">🧬</div><div className="category-info"><div className="category-title">HUMAN ANATOMY</div><div className="category-desc">Test your knowledge of the human body and its systems</div></div></div>
              <div className="category-card" onClick={() => { setCategory("general"); setStage("quiz"); }}><div className="category-icon">🌍</div><div className="category-info"><div className="category-title">GENERAL QUIZ</div><div className="category-info"><div className="category-desc">Challenge yourself with questions from various fields</div></div></div></div>
              <div className="category-card" onClick={() => { setCategory("history"); setStage("quiz"); }}><div className="category-icon">📜</div><div className="category-info"><div className="category-title">HISTORY</div><div className="category-desc">Journey through time and test your historical knowledge</div></div></div>
              <div className="category-card" onClick={() => { setCategory("all"); setStage("quiz"); }}><div className="category-icon">🎲</div><div className="category-info"><div className="category-title">ALL CATEGORIES</div><div className="category-desc">Mix questions from all categories for a diverse challenge</div></div></div>
            </div>
          </div>
        
          <div className="right-panel"><div className="leaderboard"><h3 className="leaderboard-title">🏆 {modeTitle.toUpperCase()} LEADERBOARD</h3>{(leaderboards[gameMode] || []).length === 0 ? <p className="empty-leaderboard-text">No scores yet. Be the first!</p> : leaderboards[gameMode].map((entry, i) => (<div key={i} className="leaderboard-item"><span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'}</span><span>{entry.score} pts</span></div>))}</div></div>
        </div>
        <div className="footer"><button className="button button-back" onClick={() => setStage("front")}>🏠 BACK TO MODES</button><div className="version">QUIZ ARCADE v2.chate</div></div>
      </div>
    );
  }

  if (stage === "quiz") {
    const isMultipleChoice = gameMode === "multiple";
    const isBoolean = gameMode === "boolean";
    const isIdentification = gameMode === "identification";
    const questionObj = questions[currentQuestion];
    if (!questionObj) { return <div className="container"><div className="header"><h1 className="title">ERROR</h1></div><div className="main-content"><div className="center-content"><div className="error-message">No questions available</div></div></div></div>; }
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const timerDuration = getTimerDuration();
    
    return (
      <div className="container">
        <div className="header"><h1 className="title">{category.toUpperCase()} {isMultipleChoice ? "QUIZ" : isBoolean ? "QUIZ" : "IDENTIFICATION"}</h1><div className={`timer ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`}><span>⏱️</span><span>{timeLeft}s</span></div></div>
        <div className="main-content">
          <div className="side-panel"><h3 className="game-info">QUESTION INFO</h3><div className="info-content"><p>Question {currentQuestion + 1} of {questions.length}</p><p>Category: {category.toUpperCase()}</p><p>Mode: {isMultipleChoice ? "Multiple Choice" : isBoolean ? "True or False" : "Identification"}</p><p>Time limit: {timerDuration}s</p></div><div className="progress-container"><h3 className="game-info">PROGRESS</h3><div className="progress"><div className="progress-bar" style={{ width: `${progress}%` }}></div></div><p className="progress-text">{Math.round(progress)}% Complete</p></div><div className="score-container"><h3 className="game-info">SCORE</h3><div className="score-display">{score}</div></div></div>
          <div className="center-content">
            <div className="decorative-element decorative-element-1"></div>
            <div className="decorative-element decorative-element-2"></div>
            <div className="question-card">
              <h3 className="question-title">{questionObj.question}</h3>
              {isMultipleChoice ? (
                <div>{questionObj.options.map((option, index) => {
                  let buttonClass = "option-button";
                  if (selectedOption !== null) {
                    if (option === questionObj.answer) buttonClass += " correct-option";
                    else if (index === selectedOption) buttonClass += " wrong-option";
                  }
                  return <button key={index} className={buttonClass} onClick={() => handleOptionClick(index)} disabled={selectedOption !== null}>{option}</button>;
                })}</div>
              ) : isBoolean ? (
               
                <div className="boolean-options-container">
                  <button className={`boolean-option-button ${selectedOption === true ? 'selected-true' : ''} ${selectedOption !== null && questionObj.answer === true ? 'correct-option' : ''} ${selectedOption === true && questionObj.answer === false ? 'wrong-option' : ''}`} onClick={() => handleBooleanClick(true)} disabled={selectedOption !== null}>TRUE</button>
                  <button className={`boolean-option-button ${selectedOption === false ? 'selected-false' : ''} ${selectedOption !== null && questionObj.answer === false ? 'correct-option' : ''} ${selectedOption === false && questionObj.answer === true ? 'wrong-option' : ''}`} onClick={() => handleBooleanClick(false)} disabled={selectedOption !== null}>FALSE</button>
                </div>
              ) : (
                <div>
                  <div className="identification-box"><p className="identification-clue">💡 Think carefully and type your answer below.</p>{showHint && questionObj.hint && (<div className="hint-box"><p className="hint-text">💡 Hint: {questionObj.hint}</p></div>)}</div>
                  <input type="text" className="input-field" placeholder="Type your answer here..." value={identificationAnswer} onChange={(e) => setIdentificationAnswer(e.target.value)} disabled={selectedOption !== null} />
                  <div className="flex-buttons"><button className="button hint-button" onClick={handleHintClick} disabled={hintsRemaining === 0 || showHint || selectedOption !== null}>💡 Hint ({hintsRemaining})</button><button className="button submit-button" onClick={handleIdentificationSubmit} disabled={selectedOption !== null}>SUBMIT</button></div>
                  {selectedOption !== null && (<div className={`answer-feedback ${identificationAnswer.toLowerCase().trim() === questionObj.answer.toLowerCase() ? 'correct' : 'incorrect'}`}><p className="answer-text">{identificationAnswer.toLowerCase().trim() === questionObj.answer.toLowerCase() ? '✓ Correct!' : `✗ Incorrect. The answer is: ${questionObj.answer}`}</p></div>)}
                </div>
              )}
            </div>
          </div>
          <div className="right-panel"><div className="timer-panel"><h3 className="stats-title">TIMER</h3><div className={`timer-display ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`}>{timeLeft}</div><div className="progress"><div className={`progress-bar ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`} style={{ width: `${(timeLeft / timerDuration) * 100}%` }}></div></div></div><div className="stats-panel"><h3 className="stats-title">STATS</h3><div className="stats-content"><p>Correct: {score}</p><p>Remaining: {questions.length - currentQuestion - 1}</p><p>Accuracy: {currentQuestion > 0 ? Math.round((score / (currentQuestion + 1)) * 100) : 0}%</p></div></div></div>
        </div>
        <div className="footer"><button className="button button-back" onClick={resetGame}>🏠 BACK TO GAME MODE</button><div className="version">QUIZ ARCADE v2.chate</div></div>
      </div>
    );
  }

  if (stage === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    const modeTitle = gameMode === "multiple" ? "MULTIPLE CHOICE" : gameMode === "boolean" ? "TRUE OR FALSE" : "IDENTIFICATION";
    return (
      <div className="container">
        <div className="header"><h1 className="title">QUIZ RESULTS</h1><div className="timer"><span>🏆</span><span>{percentage}%</span></div></div>
        <div className="main-content">
          <div className="side-panel"><h3 className="game-info">PERFORMANCE</h3><div className="info-content"><p>Category: {category.toUpperCase()}</p><p>Mode: {modeTitle}</p><p>Correct: {score}/{questions.length}</p><p>Accuracy: {percentage}%</p></div><div className="achievement-container"><h3 className="game-info">ACHIEVEMENT</h3><div className={`achievement ${percentage >= 80 ? 'gold' : percentage >= 60 ? 'silver' : 'bronze'}`}>{percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'}</div></div></div>
          <div className="center-content">
            <div className="decorative-element decorative-element-1"></div>
            <div className="decorative-element decorative-element-2"></div>
            <div className="question-card">
              <h2 className="section-title">QUIZ COMPLETED!</h2>
              <div className="result-summary"><div className="result-message">{score}/{questions.length}</div><div className="result-description">{percentage >= 80 ? "🏆 Outstanding! You're a quiz master!" : percentage >= 60 ? "🎉 Good job! You know your stuff!" : "📚 Keep learning and try again!"}</div></div>
              <div className="button-group"><button className="button button-play" onClick={resetGame}>🔄 PLAY AGAIN</button><button className="button button-back" onClick={resetGame}>🏠 GAME MODES</button></div>
            </div>
          </div> 
          <div className="right-panel"><div className="leaderboard"><h3 className="leaderboard-title">🏆 {modeTitle.toUpperCase()} LEADERBOARD</h3>{(leaderboards[gameMode] || []).length === 0 ? <p className="empty-leaderboard-text">No scores yet. Be the first!</p> : leaderboards[gameMode].map((entry, i) => (<div key={i} className={`leaderboard-item ${entry.category === category && entry.gameMode === gameMode && entry.score === score ? 'highlight' : ''}`}><span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'}</span><span>{entry.score} pts</span></div>))}</div></div>
        </div>
        <div className="footer"><button className="button button-home" onClick={() => navigate('/home')}>🏠 HOME</button><div className="version">QUIZ ARCADE v2.chate</div></div>
      </div>
    );
  }

  return (<div className="container"><div className="header"><h1 className="title">ERROR</h1></div><div className="main-content"><div className="center-content"><div className="centered-flex-column"><div className="error-message">Something went wrong. Please refresh the page.</div></div></div></div></div>);
};

export default QuizGame;

