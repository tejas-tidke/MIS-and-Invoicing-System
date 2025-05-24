package com.codeb.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.codeb.entity.Client;
import com.codeb.jpa.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientService {

	private final ClientRepository clientRepository;

	public List<Client> getAllClients() {
		return clientRepository.findAll();
	}

	public Optional<Client> getClientById(Long id) {
		return clientRepository.findById(id);
	}

	public Client createClient(Client client) {
		return clientRepository.save(client);
	}

	public Client updateClient(Long id, Client updatedClient) {
	    Optional<Client> optionalClient = clientRepository.findById(id);
	    if (optionalClient.isPresent()) {
	        Client client = optionalClient.get();
	        client.setName(updatedClient.getName());
	        client.setOrganizationDetails(updatedClient.getOrganizationDetails());
	        return clientRepository.save(client);
	    } else {
	        throw new RuntimeException("Client not found with id: " + id);
	    }
	}

	public void deleteClient(Long id) {
		clientRepository.deleteById(id);
	}
}