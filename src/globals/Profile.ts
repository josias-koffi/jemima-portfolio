import type { Block, GlobalConfig } from 'payload'

import { revalidateGlobal } from '../lib/revalidate'

const IntroText: Block = {
  slug: 'text',
  labels: { singular: 'Texte', plural: 'Textes' },
  fields: [{ name: 'text', label: 'Texte', type: 'text', required: true }],
}

const IntroWord: Block = {
  slug: 'word',
  labels: { singular: 'Mot en gras (survol)', plural: 'Mots en gras' },
  fields: [
    { name: 'label', label: 'Mot', type: 'text', required: true },
    {
      name: 'image',
      label: 'Image révélée au survol',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Sinon, la note ci-dessous s’affiche sur une carte bordeaux.' },
    },
    { name: 'note', label: 'Note (si pas d’image)', type: 'text' },
    {
      name: 'tilt',
      label: 'Inclinaison',
      type: 'radio',
      defaultValue: 'l',
      options: [
        { label: 'Vers la gauche', value: 'l' },
        { label: 'Vers la droite', value: 'r' },
      ],
    },
  ],
}

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profil & accueil',
  admin: { group: 'Contenu', description: 'Infos générales : hero, À propos, contact.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('profile')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', label: 'Prénom', type: 'text', required: true },
                { name: 'lastName', label: 'Nom', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'location', label: 'Lieu', type: 'text' },
                { name: 'role', label: 'Métier (ligne du haut)', type: 'text' },
              ],
            },
            {
              name: 'intro',
              label: 'Phrase d’accroche',
              type: 'blocks',
              blocks: [IntroText, IntroWord],
              admin: {
                description:
                  'Alterner des blocs « Texte » et « Mot en gras ». Les espaces et la ponctuation sont dans les blocs Texte.',
              },
            },
            {
              name: 'availability',
              label: 'Disponibilité (pastille du hero)',
              type: 'text',
              admin: { description: 'Ex. « En recherche d’alternance / stage — Paris ». Laisser vide pour masquer la pastille.' },
            },
            { name: 'heroPhoto', label: 'Photo du hero', type: 'upload', relationTo: 'media' },
            { name: 'marquee', label: 'Bandeau défilant', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
          ],
        },
        {
          label: 'À propos',
          fields: [
            { name: 'portrait', label: 'Photo « À propos »', type: 'upload', relationTo: 'media' },
            { name: 'status', label: 'Légende sous la photo', type: 'text' },
            { name: 'about', label: 'Paragraphes', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
            {
              name: 'drive',
              label: 'Ce qui m’anime (grande phrase)',
              type: 'textarea',
              admin: { description: 'Affichée en grand, en italique, sous les paragraphes.' },
            },
            {
              name: 'expertises',
              label: 'Expertises (4 blocs)',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Catégorie', type: 'text', required: true },
                    { name: 'title', label: 'Titre', type: 'text', required: true },
                  ],
                },
                { name: 'items', label: 'Éléments', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
              ],
            },
            {
              name: 'tools',
              label: 'Outils (sous les expertises)',
              type: 'array',
              labels: { singular: 'Pilier', plural: 'Piliers' },
              fields: [
                { name: 'label', label: 'Pilier', type: 'text', required: true },
                { name: 'items', label: 'Outils', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
              ],
            },
            { name: 'process', label: 'Méthode (étapes)', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
            {
              name: 'testimonials',
              label: 'Témoignages',
              type: 'array',
              labels: { singular: 'Témoignage', plural: 'Témoignages' },
              admin: { description: 'Uniquement de vrais retours (manager, client, partenaire). Section masquée si vide.' },
              fields: [
                { name: 'quote', label: 'Citation', type: 'textarea', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'author', label: 'Auteur', type: 'text', required: true },
                    { name: 'context', label: 'Fonction / entreprise', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & partage',
          fields: [
            {
              name: 'contactLead',
              label: 'Phrase du pied de page',
              type: 'textarea',
              admin: { description: 'Sous « Parlons-en. ».' },
            },
            { name: 'email', label: 'E-mail', type: 'email' },
            {
              name: 'cv',
              label: 'CV (PDF)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { equals: 'application/pdf' } },
              admin: { description: 'Affiche les boutons « Télécharger mon CV » (pied de page et menu).' },
            },
            { name: 'phone', label: 'Téléphone (laisser vide pour ne pas l’afficher)', type: 'text' },
            { name: 'linkedin', label: 'LinkedIn (URL)', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'instagram', label: 'Instagram (URL)', type: 'text' },
                { name: 'instagramLabel', label: 'Texte du bouton Instagram', type: 'text' },
              ],
            },
            {
              name: 'shareImage',
              label: 'Image d’aperçu de partage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Affichée quand on partage le lien (LinkedIn, WhatsApp…). Par défaut : photo À propos.' },
            },
          ],
        },
      ],
    },
  ],
}
