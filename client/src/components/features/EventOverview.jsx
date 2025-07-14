/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Award, Calendar, Clock, Coffee, MapPin, Users } from "lucide-react";
import { useEventStore } from "@stores/eventStore";

const EventOverview = () => {
  const { event } = useEventStore();

  const highlights = [
    {
      icon: Users,
      title: `${event.speakers.length} Experts`,
      description: "Intervenants de renommée internationale",
    },
    {
      icon: Clock,
      title: "8 Heures",
      description: "De contenu premium et networking",
    },
    {
      icon: Award,
      title: "Certificat",
      description: "Certification officielle incluse",
    },
    {
      icon: Coffee,
      title: "Tout Inclus",
      description: "Pauses et déjeuner compris",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi participer à
            <span className="text-gradient"> cet événement ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {event.longDescription.split("\n")[0]}
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <highlight.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {highlight.title}
              </h3>
              <p className="text-gray-600">{highlight.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                À propos de l'événement
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {event.longDescription
                  .split("\n")
                  .filter((p) => p.trim())
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
              </div>

              {/* Key Features */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Ce qui est inclus :
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                Détails de l'événement
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Date et heure
                    </div>
                    <div className="text-gray-600">
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-gray-600">
                      {event.time} - {event.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-secondary-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Lieu</div>
                    <div className="text-gray-600">{event.location.venue}</div>
                    <div className="text-gray-600">
                      {event.location.address}
                    </div>
                    <div className="text-gray-600">
                      {event.location.city}, {event.location.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Participants
                    </div>
                    <div className="text-gray-600">
                      {event.currentRegistrations} inscrits
                    </div>
                    <div className="text-gray-600">
                      {event.maxParticipants - event.currentRegistrations}{" "}
                      places restantes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventOverview;
