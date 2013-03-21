
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
