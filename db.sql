-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Lun 04 Mars 2013 à 18:55
-- Version du serveur: 5.5.9
-- Version de PHP: 5.3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `wedding`
--

-- --------------------------------------------------------

--
-- Structure de la table `compose`
--

DROP TABLE IF EXISTS `compose`;
CREATE TABLE IF NOT EXISTS `compose` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_inscription` int(11) NOT NULL,
  `id_invite` int(11) NOT NULL,
  `date_lien` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_invite` (`id_invite`),
  KEY `fk_id_inscription` (`id_inscription`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `compose`
--

INSERT INTO `compose` VALUES(1, 1, 150, '2013-03-03 15:13:58');

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

DROP TABLE IF EXISTS `inscription`;
CREATE TABLE IF NOT EXISTS `inscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(256) NOT NULL,
  `prenom` varchar(256) NOT NULL,
  `nb_adultes` int(11) DEFAULT '1',
  `nb_enfants` int(11) DEFAULT '0',
  `nb_couchages` int(11) DEFAULT '0',
  `presence_dimanche` tinyint(1) DEFAULT '0',
  `besoin_navette` tinyint(1) DEFAULT '0',
  `lieu_navette` varchar(512) DEFAULT NULL,
  `date_inscription` datetime DEFAULT NULL COMMENT '		',
  `ip` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `inscription`
--

INSERT INTO `inscription` VALUES(1, 'Paquelier', 'Michael', 1, 0, 0, 1, 0, NULL, '2013-03-03 15:02:36', '127.0.0.1', 1);

-- --------------------------------------------------------

--
-- Structure de la table `invite`
--

DROP TABLE IF EXISTS `invite`;
CREATE TABLE IF NOT EXISTS `invite` (
  `id` int(11) NOT NULL,
  `nom` varchar(256) NOT NULL,
  `prenom` varchar(256) DEFAULT NULL,
  `nb_adultes` int(11) DEFAULT '1',
  `nb_enfants` int(11) DEFAULT '0',
  `presence_ceremonie` tinyint(1) DEFAULT '0',
  `presence_repas` tinyint(1) DEFAULT '1',
  `presence_apero` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `invite`
--

INSERT INTO `invite` VALUES(1, 'Éric', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(2, 'Véronique', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(3, 'Marine', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(4, 'Vanessa', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(5, 'Michèle', 'Clavequin', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(6, 'Colette', 'Clavequin', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(7, 'Coralie', 'Paquelier', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(8, 'François', 'Berenger', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(9, 'Gérard', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(10, 'Jeanine', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(11, 'Thierry', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(12, 'Valérie', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(13, 'Patricia', 'Ehret', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(14, 'Roger', 'Mathieu', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(15, 'Alicia', 'Mathieu', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(16, 'Aurore', 'Langelier', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(17, 'Sébastien', 'Langelier', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(18, 'Robert', 'Naal', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(19, 'Raymond', 'Lucas', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(20, 'Boni', 'Lucass', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(21, 'Rodolphe', 'Lucas', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(22, 'Michel', 'Lucas', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(23, 'Nelida', 'Lucas', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(24, 'Micky', 'Clotet', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(25, 'Montsey', 'Clotet', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(26, 'Carlos', 'Pereto', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(27, 'Magali', 'Miro', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(28, 'Jeannot', 'Miro', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(29, 'Christiane', 'Miro', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(30, 'Pascal', 'Deichelborer', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(31, 'Annie', 'Deichelborer', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(32, 'Christian', 'Duengler', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(33, 'Josiane', 'Duengler', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(34, 'Franck', 'Champagne', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(35, 'Marie-Hélène', 'champagne', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(36, 'Jean-Luc', 'Roy', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(37, 'Michele', 'Roy', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(38, 'Benjamin', 'Roy', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(39, 'Guillaume', 'Roy', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(40, 'Johann', 'Christ', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(41, 'Priscille', 'Corbion', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(42, 'Marine', 'Grabowski', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(43, 'Marie', 'GRabowski', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(44, 'Caroline', 'Grabowski', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(45, 'Jenna', 'Rodriguez', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(46, 'Milène', 'Lindecker', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(47, 'Clément', 'Pierrat', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(48, 'Marion', 'Lindecker', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(49, 'Mélanie', 'Carreau', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(50, 'Audrey', 'Detaille', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(51, 'Sébastien', 'Detaille', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(52, 'Annie', 'Matysiak', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(53, 'Yann', 'Matysiac', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(54, 'Ludivine', 'Colin', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(55, 'Benoit', 'Matysiac', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(56, 'Estelle', 'Nowak', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(57, 'Jacques', 'Paquelier', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(58, 'Anne', 'Prevot', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(59, 'Philippe', 'Lacroix', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(60, 'Andrée', 'Lacroix', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(61, 'Laurine', 'Lacroix', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(62, 'Ophélie', 'Lacroix', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(63, 'Mr', 'Lacroix', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(64, 'Mme', 'LAcroix', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(65, 'Philippe', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(66, 'Pascale', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(67, 'Monique', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(68, 'Cécile', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(69, 'Annie', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(70, 'Marcel', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(71, 'Roger', 'Paquelier', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(72, 'Vanessa', 'Delteil', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(73, 'Oswald', '0', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(74, 'Rémi', 'Erhard', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(75, 'Sylvain', 'Ternant', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(76, 'Yann', 'Hoang', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(77, 'Angéline', 'Gaucherot', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(78, 'Karl', 'Welklen', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(79, 'Virginie', 'Haaz', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(80, 'Rudy', '0', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(81, 'Agnes', '0', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(82, 'Dany', 'Bailly', 1, 0, 1, 1, 1);
INSERT INTO `invite` VALUES(83, 'Cécile', 'Dumont', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(84, 'Arnaud', 'Christ', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(85, 'Carole', 'Richard', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(86, 'Gaetan', 'Perrin', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(87, 'Emilie', 'Deichelborer', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(88, 'Fabien', 'Deichelborer', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(89, 'Stéphanie', 'Deichelborer', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(90, 'Jerome', 'Achard', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(91, 'Jessica', 'Duengler', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(92, 'Jimmy', 'Duengler', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(93, 'Alphonsie', 'Lecomte', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(94, 'Jacky', 'Lecomte', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(95, 'Jennifer', 'Lecomte', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(96, 'François', 'Lirot', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(97, 'Tamara', 'Lecomte', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(98, 'Roman', 'Grabowski', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(99, 'Agnès', 'Grabowski', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(100, 'Camille', 'Cagnelle', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(101, 'Adrien', 'Cagnelle', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(102, 'Maman', 'Cagnelle', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(103, 'Papa', 'Cagnelle', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(104, 'Blandine', 'Marchal', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(105, 'Patrice', 'Vitali', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(106, 'Antoine', 'Vitali', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(107, 'Josselin', 'Vitali', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(108, 'Patricia', 'cousine papa', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(109, 'Josette', 'Naal', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(110, 'Christelle', 'Naal', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(111, 'Corinne', 'Naal', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(112, 'Jeanine', 'Lucas', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(113, 'Marie-Jo', 'Lucas', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(114, 'Jean-Claude', 'Lucas', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(115, 'Catherine', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(116, 'Valérie', 'Dubois', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(117, 'Christophe', 'Dubois', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(118, 'Justine', 'Dubois', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(119, 'Pierre', 'Dubois', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(120, 'Adrien', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(121, 'Denis', 'Barret', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(122, 'Jean-Jacque', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(123, 'Sandrine', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(124, 'Aurélia', 'voisine', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(125, 'Francisco', 'voisin', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(126, 'Mme', 'Buhot', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(127, 'Mr', 'Arpinot', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(128, 'Gilles', 'Chaboude', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(129, 'Marie-Laure', 'Chaboude', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(130, 'Melissa', 'Fiegel', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(131, 'Fanny', 'Yung', 1, 0, 0, 1, 1);
INSERT INTO `invite` VALUES(132, 'Brice', 'Martin', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(133, 'Steve', 'Martin', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(134, 'Camille', 'Colin', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(135, 'Yohann', 'Paquelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(136, 'Justine', 'Paquelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(137, 'Valérian', 'Paquelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(138, 'Solene', 'Paquelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(139, 'Théo', 'Ehret', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(140, 'Jimmy', 'Ehret', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(141, 'Clément', 'Ehret', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(142, 'Mathilde', 'Langelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(143, 'Bénédicte', 'Langelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(144, 'Baptiste', 'Langelier', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(145, 'Emma', 'Lucas', 1, 0, 1, 0, 1);
INSERT INTO `invite` VALUES(146, 'Gina', 'Clotet', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(147, 'Joel', 'Clotet', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(148, 'Lily-Rose', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(149, 'Liam', '0', 1, 0, 0, 0, 1);
INSERT INTO `invite` VALUES(150, 'Paquelier', 'Michael', 1, 0, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `log_connexion`
--

DROP TABLE IF EXISTS `log_connexion`;
CREATE TABLE IF NOT EXISTS `log_connexion` (
  `id` int(11) NOT NULL,
  `date_connexion` datetime DEFAULT NULL,
  `valide` tinyint(1) DEFAULT NULL,
  `mot_de_passe` varchar(256) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `navigateur` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `log_connexion`
--


--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `compose`
--
ALTER TABLE `compose`
  ADD CONSTRAINT `fk_id_invite` FOREIGN KEY (`id_invite`) REFERENCES `invite` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_id_inscription` FOREIGN KEY (`id_inscription`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
